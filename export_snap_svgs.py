from pathlib import Path
import math
import xml.etree.ElementTree as ET

OUT = Path(__file__).parent / 'SNAP verification charts'
OUT.mkdir(exist_ok=True)
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

def element(parent, tag, attrs=None, text=None):
    node = ET.SubElement(parent, f'{{{NS}}}{tag}', attrs or {})
    if text is not None:
        node.text = text
    return node

def label(parent, x, y, text, size=20, color='#222222', anchor='start', weight='400'):
    return element(parent, 'text', {'x': str(x), 'y': str(y), 'font-family': 'Arial, Helvetica, sans-serif', 'font-size': str(size), 'fill': color, 'text-anchor': anchor, 'font-weight': weight}, text)

# Resolved Massachusetts Design System semantic colors for portable SVGs:
# primary-highest, informative-mid, neutral-low, secondary-mid.
DARK_BLUE, MID_BLUE, LIGHT_GRAY, GREEN = '#0A2B48', '#7299BC', '#E6E6E6', '#2D6A46'
groups = [
    ('snap-group-a-high-contrast.svg', 'At interview', 9470, 2950, 1059, 'Not wrapped at interview', 'Wrapped at interview', False),
    ('snap-group-b-high-contrast.svg', 'At worker action (interview waived/EDSAP)', 8388, 5640, 1266, 'Not wrapped at worker action', 'Wrapped at worker action', False),
    ('snap-at-interview-pilot-high-contrast.svg', 'At interview - Pilot scenario', 9470, 3897, 1059, 'Remaining not wrapped', 'Projected total wrapped', True),
    ('snap-total-initial-worker-actions.svg', 'Across all initial worker actions:  Interview and worker action (when interview is waived/ EDSAP)', 17858, 8590, 2325, 'Remaining not wrapped', 'Wrapped at initial worker action', False),
    ('snap-total-worker-actions-pilot.svg', 'Across all worker actions (interview and when interview is waived/EDSAP) - Potential pilot scenario', 17858, 10376, 2325, 'Remaining not wrapped', 'Projected total wrapped', True),
]
for filename, title, total, wrapped, vc1, not_wrapped, wrap_label, pilot in groups:
    additional = round(total * 0.10) if pilot else 0
    values = [wrapped - additional - vc1, vc1, additional, total - wrapped] if pilot else [wrapped - vc1, vc1, total - wrapped]
    labels = ['Wrapped (no VC-1 issued)', 'Wrapped (but VC-1 also issued)']
    if pilot:
        labels.append('Additional wrapped cases with pilot (TBD)')
    labels.append(not_wrapped)
    colors = [DARK_BLUE, MID_BLUE, GREEN, LIGHT_GRAY] if pilot else [DARK_BLUE, MID_BLUE, LIGHT_GRAY]
    is_combined = filename.startswith('snap-total-')
    header_offset = 62 if is_combined else 0
    height = (768 if pilot else 740) + header_offset
    assert sum(values) == total
    root = ET.Element(f'{{{NS}}}svg', {'width': '760', 'height': str(height), 'viewBox': f'0 0 760 {height}', 'role': 'img', 'aria-labelledby': 'title desc'})
    element(root, 'title', {'id': 'title'}, title)
    element(root, 'desc', {'id': 'desc'}, f'{total:,} total cases. ' + '; '.join(f'{name}: {value:,}, {value/total:.1%} of all cases' for name, value in zip(labels, values)) + f'. Wrapped cases: {wrapped:,}, {wrapped/total:.1%}.' + (' Pilot scenario adds 10 percentage points. VC-1 status of the additional cases is unspecified.' if pilot else f' VC-1 among wrapped cases: {vc1/wrapped:.1%}.'))
    element(root, 'rect', {'width': '760', 'height': str(height), 'fill': '#FFFFFF'})
    if is_combined:
        title_lines = ['Across all worker actions', '(interview and when interview is waived/EDSAP)', '- Potential pilot scenario'] if pilot else ['Across all initial worker actions:', 'Interview and worker action', '(when interview is waived/ EDSAP)']
        for i, line in enumerate(title_lines):
            label(root, 40, 52+31*i, line, 26, '#14558F', weight='500')
    else:
        label(root, 40, 52, title, 26, '#14558F', weight='500')
    content = element(root, 'g', {'transform': f'translate(0,{header_offset})'})
    label(content, 40, 89, f'{total:,} total cases', 21)
    label(content, 40, 121, ('10% of all cases additionally wrapped (rounded to whole cases)' if is_combined else '10% of all cases additionally wrapped with intervention') if pilot else 'Pie slices represent all cases in this group.', 17, '#535353')
    angle = -math.pi / 2
    for value, color in zip(values, colors):
        end = angle + value / total * 2 * math.pi
        x1, y1 = 380 + 160 * math.cos(angle), 315 + 160 * math.sin(angle)
        x2, y2 = 380 + 160 * math.cos(end), 315 + 160 * math.sin(end)
        element(content, 'path', {'d': f'M380,315 L{x1:.4f},{y1:.4f} A160,160 0 {int(end-angle>math.pi)},1 {x2:.4f},{y2:.4f} Z', 'fill': color, 'stroke': '#141414', 'stroke-width': '1.5', 'stroke-linejoin': 'round'})
        mid = (angle + end)/2
        label(content, 380+108*math.cos(mid), 315+108*math.sin(mid)+7, f'{value/total:.1%}', 21, '#FFFFFF' if color in [DARK_BLUE, GREEN] else '#141414', anchor='middle', weight='500')
        angle = end
    for i, (name, value, color) in enumerate(zip(labels, values, colors)):
        y = 526 + 28 * i
        element(content, 'rect', {'x': '40', 'y': str(y-16), 'width': '16', 'height': '16', 'fill': color})
        label(content, 70, y, name, 20)
        label(content, 720, y, f'{value:,}  ({value/total:.1%})', 20, anchor='end')
    shift = 28 if pilot else 0
    element(content, 'line', {'x1': '40', 'x2': '720', 'y1': str(612+shift), 'y2': str(612+shift), 'stroke': '#D6D6D6'})
    label(content, 40, 650+shift, wrap_label, 19)
    label(content, 720, 650+shift, f'{wrapped:,} / {total:,}  ({wrapped/total:.1%})', 19, anchor='end')
    label(content, 40, 689+shift, 'Increase in wrap rate' if pilot else 'VC-1 among wrapped cases', 19)
    label(content, 720, 689+shift, '+10 percentage points' if pilot else f'{vc1:,} / {wrapped:,}  ({vc1/wrapped:.1%})', 19, anchor='end')
    path = OUT / filename
    ET.ElementTree(root).write(path, encoding='utf-8', xml_declaration=True)
    ET.parse(path)
    print(path)
