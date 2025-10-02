import cv2
import subprocess
import numpy as np

# Open video
cap = cv2.VideoCapture(r"C:/MYSPACE/CODE/NASA/change/blackhole.webm")
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

# Fallback FPS if OpenCV fails
if fps == 0 or np.isnan(fps):
    fps = 30

# FFmpeg command
ffmpeg_cmd = [
    'ffmpeg',  # or full path e.g., r'C:\ffmpeg\bin\ffmpeg.exe'
    '-y',  # overwrite
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', f'{width}x{height}',
    '-r', str(fps),
    '-i', '-',  # input from pipe
    '-c:v', 'libvpx',  # VP8 codec
    '-crf', '10',
    '-b:v', '1M',
    'output.webm'
]

proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

# HSV range for #040013 (optional masking)
lower_color = np.array([120, 0, 0])
upper_color = np.array([130, 255, 40])

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Mask out specific color (optional)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_color, upper_color)
    mask_inv = cv2.bitwise_not(mask)
    result = cv2.bitwise_and(frame, frame, mask=mask_inv)

    # Compute brightness per pixel (0-1)
    brightness = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) / 255.0

    # Alpha factor based on brightness
    # darker pixels → lower alpha, brighter pixels → higher alpha
    alpha = np.clip(brightness * 1.5, 0.1, 1.0)

    # Apply alpha to frame
    final = (result * alpha[..., None]).astype(np.uint8)

    # Write frame to FFmpeg stdin
    proc.stdin.write(final.tobytes())

cap.release()
proc.stdin.close()
proc.wait()
print("Done! Video saved as output.webm")
