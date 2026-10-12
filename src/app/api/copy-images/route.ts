import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\992e4b06-bc83-4cfe-855b-8982a7bb486c';
    const destDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const mapping = [
      {
        src: path.join(brainDir, 'hub_pvc_smartcard_1791649573236.jpg'),
        dest: path.join(destDir, 'hub_pvc_smartcard.jpg')
      },
      {
        src: path.join(brainDir, 'hub_remita_payment_1791649632365.jpg'),
        dest: path.join(destDir, 'hub_remita_payment.jpg')
      },
      {
        src: path.join(brainDir, 'hub_biometrics_registration_1791649700033.jpg'),
        dest: path.join(destDir, 'hub_biometrics_registration.jpg')
      },
      {
        src: path.join(brainDir, 'hub_thesis_binding_1791649738674.jpg'),
        dest: path.join(destDir, 'hub_thesis_binding.jpg')
      }
    ];

    const results = [];
    for (const item of mapping) {
      if (fs.existsSync(/*turbopackIgnore: true*/ item.src)) {
        fs.copyFileSync(item.src, item.dest);
        results.push({ file: path.basename(item.dest), status: 'copied' });
      } else {
        results.push({ file: path.basename(item.dest), status: 'src_not_found', src: item.src });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
