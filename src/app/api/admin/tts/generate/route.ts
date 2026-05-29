// app/api/admin/tts/generate/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin triggers this to pre-generate high-quality audio for a word.
// Uses ElevenLabs TTS API → saves mp3 to Cloudinary → stores URL in WordBank.
// Run this for every word in the word bank before a session goes live.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { WordBank } from '@/models/WordBank';
import { withPermission } from '@/lib/rbac';
import cloudinary from '@/lib/cloudinary';

const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL'; 
// Default: ElevenLabs "Bella" voice — clear, neutral, professional

async function handler(req: NextRequest) {
  try {
    await connectDB();
    const { wordId } = await req.json() as { wordId: string };

    const word = await WordBank.findById(wordId);
    if (!word) return NextResponse.json({ error: 'Word not found' }, { status: 404 });

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key is not configured in environment variables.' }, { status: 500 });
    }

    // Build the text to speak:
    // "The word is [WORD]. [WORD]."
    // ElevenLabs will pronounce it as a natural word.
    const speakText = word.ttsOverrideText?.trim()
      ? word.ttsOverrideText.trim()
      : word.targetWord.toLowerCase();

    const ttsText = `The word is ${speakText}. ${speakText}.`;

    // Call ElevenLabs API
    const elResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: ttsText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,           // Consistent pronunciation
            similarity_boost: 0.85,    // Natural sound
            style: 0.20,               // Slight expression — not robotic
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elResponse.ok) {
      const err = await elResponse.json();
      return NextResponse.json({ error: 'ElevenLabs error', details: err }, { status: 502 });
    }

    // Convert response to Buffer
    const audioBuffer = Buffer.from(await elResponse.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',          // Cloudinary uses 'video' for audio
          folder: 'modern-bee/tts',
          public_id: wordId,
          format: 'mp3',
          overwrite: true,
          tags: ['tts', 'modern-bee', word.group],
        },
        (error, result) => error ? reject(error) : resolve(result)
      );
      uploadStream.end(audioBuffer);
    });

    // Save URL back to WordBank
    word.audioUrlHighQuality = uploadResult.secure_url;
    await word.save();

    return NextResponse.json({
      success: true,
      wordId,
      targetWord: word.targetWord,
      audioUrl: uploadResult.secure_url,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withPermission('word_bank:write', handler);
