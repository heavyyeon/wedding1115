"""
개발 미리보기를 위한 자리표시자 이미지를 생성합니다.
실제 배포 전에는 /public 아래 같은 파일명으로 진짜 사진을 교체해주세요.
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(os.path.join(BASE, "gallery"), exist_ok=True)

BG = (242, 248, 237)
ACCENT = (168, 217, 108)
TEXT = (90, 100, 80)


def font(size):
    try:
        return ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size
        )
    except Exception:
        return ImageFont.load_default()


def placeholder(path, size, label, bg=BG, fg=TEXT):
    img = Image.new("RGB", size, bg)
    draw = ImageDraw.Draw(img)
    f = font(max(14, size[0] // 12))
    bbox = draw.textbbox((0, 0), label, font=f)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.rectangle([8, 8, size[0] - 8, size[1] - 8], outline=ACCENT, width=3)
    draw.text(
        ((size[0] - w) / 2, (size[1] - h) / 2 - bbox[1]), label, font=f, fill=fg
    )
    if str(path).lower().endswith((".jpg", ".jpeg")):
        img.save(path, quality=88)
    else:
        img.save(path)


placeholder(os.path.join(BASE, "main-photo.jpg"), (960, 1600), "MAIN PHOTO\n(교체 필요)")
placeholder(os.path.join(BASE, "groom.jpg"), (600, 800), "GROOM")
placeholder(os.path.join(BASE, "bride.jpg"), (600, 800), "BRIDE")
placeholder(os.path.join(BASE, "kakao.jpg"), (800, 400), "KAKAO OG IMAGE")
placeholder(os.path.join(BASE, "map-guide.jpg"), (900, 1200), "MAP GUIDE\n(약도 이미지, 교체 필요)")
placeholder(os.path.join(BASE, "map-preview.jpg"), (960, 640), "MAP PREVIEW\n(지도 스크린샷, 교체 필요)")

# invitation.png: 투명 배경 + 얇은 텍스트 (손글씨 이미지 자리표시자)
inv = Image.new("RGBA", (600, 240), (0, 0, 0, 0))
d = ImageDraw.Draw(inv)
f = font(40)
d.text((30, 90), "Invitation", font=f, fill=(90, 100, 80, 255))
inv.save(os.path.join(BASE, "invitation.png"))

for i in range(1, 16):
    placeholder(
        os.path.join(BASE, "gallery", f"{i}.png"),
        (600, 600),
        f"GALLERY {i}",
    )

print("placeholder images done")
