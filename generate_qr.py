import qrcode
from PIL import Image
import os

def generate_custom_qr(link, icon_path, output_path):
    # 1. Create QR Code object
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    # 2. Create the QR image with custom colors
    # #FACC15 is the primary yellow from your theme
    img_qr = qr.make_image(fill_color="#D97706", back_color="white").convert('RGB')

    # 3. Open the icon
    if os.path.exists(icon_path):
        icon = Image.open(icon_path)
        
        # Calculate dimensions to place icon in the middle
        qr_width, qr_height = img_qr.size
        icon_size = qr_width // 4  # Icon will take 1/4th of the QR code size
        
        icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        
        # Calculate position
        pos = ((qr_width - icon_size) // 2, (qr_height - icon_size) // 2)
        
        # Paste icon onto QR code
        img_qr.paste(icon, pos)
        
        print(f"QR Code generated with icon at: {output_path}")
    else:
        print(f"Warning: Icon not found at {icon_path}. Generating QR without icon.")

    # 4. Save the final image
    img_qr.save(output_path)

if __name__ == "__main__":
    # REPLACE THIS with your actual GitHub Pages URL after you upload
    github_url = "https://divyaprakashgaurav.github.io/AR_VR_website/"
    
    icon_file = "assets/icon.png"
    output_file = "assets/github_qr.png"
    
    # Install required libraries first:
    # pip install qrcode[pil] pillow
    
    generate_custom_qr(github_url, icon_file, output_file)
