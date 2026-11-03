from pathlib import Path
p=Path(__file__).parent/'public'/'projects'
p.mkdir(exist_ok=True,parents=True)

def svg(name,body,back='#eee5d8'):
 s=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="870" viewBox="0 0 1440 870"><rect width="1440" height="870" fill="{back}"/>{body}</svg>'''
 (p/name).write_text(s)

def label(x,y,t,size=16,color='#6d6963',font='Arial',weight='normal',extra=''):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-family="{font}" font-weight="{weight}" {extra}>{t}</text>'

def petals(cx,cy,scale,color='#cba59f',n=7):
 import math
 out=''
 for k in range(n):
  a=360*k/n
  out+=f'<ellipse cx="{cx}" cy="{cy-scale*.9}" rx="{scale*.54}" ry="{scale*.95}" fill="{color}" transform="rotate({a} {cx} {cy})" opacity=".9"/>'
 out+=f'<circle cx="{cx}" cy="{cy}" r="{scale*.37}" fill="#ebcf9c"/>'
 return out

# invitation
b='''<defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9d9d0"/><stop offset="1" stop-color="#b58e84"/></linearGradient></defs>
<circle cx="30" cy="125" r="350" fill="#e8d0c2"/><circle cx="1330" cy="780" r="310" fill="#b99087" opacity=".5"/>
<rect x="158" y="55" width="1130" height="775" rx="3" fill="#7b5d54" opacity=".2" transform="rotate(1 720 440)"/>
<rect x="147" y="43" width="1130" height="775" fill="#faf6ee"/>
<rect x="147" y="43" width="1130" height="54" fill="#f8f1e8"/><line x1="147" y1="97" x2="1277" y2="97" stroke="#e5d6cb"/>
<circle cx="172" cy="70" r="6" fill="#c6a9a1"/><circle cx="192" cy="70" r="6" fill="#d9c3b6"/><circle cx="212" cy="70" r="6" fill="#d9c3b6"/>
'''+label(660,76,'A CELEBRATION OF LOVE',11,'#97887d',weight='bold',extra='letter-spacing="3"')+'''
<rect x="147" y="97" width="1130" height="722" fill="#faf6ef"/>
<rect x="835" y="97" width="442" height="722" fill="#e8d4cc"/>
<path d="M1058 819 C1051 570 935 500 960 260" fill="none" stroke="#55735f" stroke-width="5"/>
<path d="M1052 815 C1152 620 1126 440 1200 284" fill="none" stroke="#55735f" stroke-width="4"/>
<path d="M1054 760 Q1008 704 945 714 Q981 767 1054 760" fill="#728a72"/>
<path d="M1052 683 Q1120 640 1150 661 Q1108 720 1052 683" fill="#7d997e"/>
<path d="M992 502 Q923 444 913 420 Q980 430 992 502" fill="#769678"/>
<path d="M1130 551 Q1203 492 1230 478 Q1210 558 1130 551" fill="#809c7b"/>
'''+petals(961,296,82,'#c8958c')+petals(1130,447,104,'#e9b8ad')+petals(1188,248,53,'#dba8a5')+petals(1006,625,70,'#d9a09a')+'''
<path d="M815 97 V819" stroke="#f3e8df" stroke-width="5"/>
'''+label(230,173,'THE INVITATION',14,'#847c70',weight='bold',extra='letter-spacing="5"')+label(230,315,'A day to',81,'#6b554c','Georgia')+label(230,408,'remember.',94,'#9f7869','Georgia',extra='font-style="italic"')+label(235,486,'TOGETHER IS A BEAUTIFUL PLACE TO BE',14,'#87746a',weight='bold',extra='letter-spacing="2"')+'''
<line x1="235" y1="542" x2="704" y2="542" stroke="#c8b3a5"/>
'''+label(235,588,'A thoughtfully crafted digital experience',19,'#796e62','Georgia')+label(235,617,'for your most meaningful moments.',19,'#796e62','Georgia')+'''
<rect x="235" y="681" width="192" height="52" fill="#846359"/>'''+label(271,714,'EXPLORE THE STORY',12,'#fff',weight='bold',extra='letter-spacing="1.2"')
svg('digital-invitations.svg',b,'#d4b9b1')

# dashboard
b='''<circle cx="1270" cy="110" r="380" fill="#c9d5ca"/><circle cx="-80" cy="830" r="380" fill="#9eaea6" opacity=".4"/>
<rect x="155" y="58" width="1150" height="756" rx="12" fill="#37443e" opacity=".14" transform="translate(13 17)"/>
<rect x="155" y="58" width="1150" height="756" rx="12" fill="#f7f8f4"/>
<path d="M167 58 H385 V814 H167 Q155 814 155 802 V70 Q155 58 167 58" fill="#28362f"/>
'''+label(201,117,'workspace.',29,'#f5f7ec',weight='bold')+label(202,177,'MAIN MENU',12,'#87968a',weight='bold',extra='letter-spacing="2"')
for i,t in enumerate(['Overview','Inquiries','Active projects','Checklist','Earnings','Settings']):
 y=234+i*70
 if i==0:b+=f'<rect x="179" y="{y-28}" width="180" height="48" rx="7" fill="#52665a"/>'
 b+=f'<circle cx="204" cy="{y-4}" r="7" fill="{("#d9e8d8" if i==0 else "#73877a")}"/>'+label(227,y,t,18,'#f0f2e9' if i==0 else '#adbbb1')
b+='''<rect x="179" y="727" width="183" height="57" rx="7" fill="#3b4c41"/>'''+label(202,760,'Project workspace',15,'#f3f4ea')
b+=label(434,124,'PROJECT OVERVIEW',15,'#9b9e94',weight='bold',extra='letter-spacing="3"')+label(434,175,'Keep every detail in view.',35,'#252e28',weight='bold')+label(1173,119,'2026 / STUDIO',12,'#929c93',extra='letter-spacing="1"')
for i,(name,value,desc) in enumerate([('ACTIVE PROJECTS','12','In production'),('NEW INQUIRIES','08','To be reviewed'),('COMPLETION RATE','78%','Overall progress')]):
 x=434+i*273
 b+=f'<rect x="{x}" y="220" width="250" height="156" rx="12" fill="{["#e4ebe1","#f0e7da","#e8ebe9"][i]}"/>'
 b+=label(x+23,256,name,12,'#77857c',weight='bold',extra='letter-spacing="1"')+label(x+23,322,value,55,'#293b32',weight='bold')+label(x+157,345,desc,11,'#8d978c')
b+='<rect x="434" y="403" width="520" height="342" rx="12" fill="#fff" stroke="#e2e6e0"/>'+label(460,443,'PROJECT PIPELINE',15,'#3f5146',weight='bold')
for i,(title,percent) in enumerate([('Website development',0.78),('Content collection',0.48),('Design review',0.63),('Client approval',0.31)]):
 y=488+i*62
 b+=label(460,y,title,15,'#5f6e61')+f'<rect x="460" y="{y+12}" width="450" height="12" rx="6" fill="#eff2ec"/><rect x="460" y="{y+12}" width="{int(450*percent)}" height="12" rx="6" fill="#92ae99"/>'
b+='<rect x="974" y="403" width="299" height="342" rx="12" fill="#eef1ed"/>'+label(999,443,'RECENT ACTIVITY',15,'#3f5146',weight='bold')
for i,(txt,sub) in enumerate([('Invitation updated','Project notes'),('Client form received','New inquiry'),('Checklist reviewed','Progress update'),('Milestone complete','Project update')]):
 y=490+i*62
 b+=f'<circle cx="1007" cy="{y-7}" r="8" fill="#a0b5a3"/>'+label(1025,y,txt,15,'#435849')+label(1025,y+18,sub,11,'#909d93')
svg('project-dashboard.svg',b,'#b7c9bc')

# Shotify
b='''<defs><radialGradient id="g"><stop stop-color="#aa6cb1"/><stop offset="1" stop-color="#342640"/></radialGradient><linearGradient id="album" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ea7a98"/><stop offset="1" stop-color="#6b60a8"/></linearGradient></defs>
<circle cx="165" cy="170" r="320" fill="#b785ad" opacity=".55"/><circle cx="1240" cy="680" r="350" fill="#6d6088" opacity=".3"/>
<circle cx="290" cy="625" r="240" fill="none" stroke="#7c6d9d" stroke-width="2"/><circle cx="1190" cy="180" r="180" fill="none" stroke="#b4a0b5" stroke-width="2"/>
'''+label(117,130,'SHOTIFY /',34,'#f1e2ef',weight='bold')+label(119,183,'THE MUSIC',62,'#f9e9f7',weight='bold')+label(120,250,'MOODBOARD',62,'#f9e9f7',weight='bold')+label(120,312,'UI CONCEPT  /  03',17,'#d9b9da',extra='letter-spacing="3"')+'''
<rect x="538" y="30" width="424" height="810" rx="59" fill="#181321" stroke="#4f4359" stroke-width="13"/>
<rect x="553" y="46" width="394" height="778" rx="49" fill="#241d2b"/>
<rect x="691" y="56" width="116" height="23" rx="12" fill="#141018"/>
'''+label(595,114,'9:41',16,'#f8eef9',weight='bold')+label(878,114,'●  ▰',16,'#efe4ef')+label(592,181,'NOW PLAYING',13,'#d0bccc',weight='bold',extra='letter-spacing="2"')+label(884,181,'•••',22,'#d0bccc')+'''
<rect x="591" y="214" width="320" height="311" rx="19" fill="url(#album)"/>
<circle cx="751" cy="361" r="114" fill="#edafbb" opacity=".3"/><circle cx="751" cy="361" r="86" fill="#412b61"/><circle cx="751" cy="361" r="63" fill="#ac85b0"/><circle cx="751" cy="361" r="39" fill="#e4b5c2"/>
<path d="M592 460 Q700 302 911 464" fill="none" stroke="#efccd7" stroke-width="2"/>
'''+label(591,572,'Afterglow',26,'#fff1fc',weight='bold')+label(592,599,'Late night sessions',15,'#a99aaa')+'''
<line x1="593" y1="641" x2="911" y2="641" stroke="#6b6371" stroke-width="5" stroke-linecap="round"/><line x1="593" y1="641" x2="769" y2="641" stroke="#e2a1be" stroke-width="5" stroke-linecap="round"/><circle cx="769" cy="641" r="8" fill="#f7c4d9"/>
'''+label(592,665,'1:42',12,'#b9a9be')+label(877,665,'3:25',12,'#b9a9be')+'''
<circle cx="751" cy="729" r="36" fill="#f4c5d9"/><path d="M744 710 L744 747 L770 729 Z" fill="#33283c"/>
<path d="M660 716 v27 m0-14 l-20-16 v32z M842 716 v27 m0-14 l20-16 v32z" fill="#d9b8ce" stroke="#d9b8ce" stroke-width="3"/>
'''+label(1050,624,'INTERFACE DESIGN',25,'#f2e3f4',weight='bold')+label(1052,662,'MUSIC. MOOD.',30,'#ddc1e0','Georgia',extra='font-style="italic"')
svg('shotify.svg',b,'#60506e')

# flower store
b='''<circle cx="125" cy="720" r="330" fill="#d2c6cc"/><circle cx="1392" cy="120" r="255" fill="#c6b3bf" opacity=".55"/>
<rect x="154" y="63" width="1137" height="756" rx="8" fill="#887f85" opacity=".18" transform="translate(15 17)"/>
<rect x="154" y="63" width="1137" height="756" rx="8" fill="#f9f7f6"/>
<rect x="154" y="63" width="1137" height="67" fill="#fff"/>
'''+label(213,109,'VIOLET',25,'#715968','Georgia')+label(324,109,'EVERGARDEN',14,'#927882',weight='bold',extra='letter-spacing="3"')+label(825,106,'HOME      COLLECTIONS      OUR STORY      CONTACT',13,'#8f8288',extra='letter-spacing="1.4"')+'''
<rect x="154" y="130" width="1137" height="590" fill="#efe7e7"/>
<rect x="818" y="130" width="473" height="590" fill="#d0bfc8"/>
<path d="M1064 720 Q1040 539 1009 363" fill="none" stroke="#587665" stroke-width="8"/>
<path d="M1090 720 Q1139 566 1176 374" fill="none" stroke="#658572" stroke-width="7"/>
<path d="M1050 600 Q943 550 941 490 Q1039 500 1050 600" fill="#719080"/>
<path d="M1117 582 Q1220 558 1240 517 Q1155 495 1117 582" fill="#7b9885"/>
'''+petals(1002,349,105,'#ae879b')+petals(1181,350,97,'#ddbdc9')+petals(1114,503,80,'#9e7a9d')+petals(1271,601,55,'#d3a5ba')+'''
<rect x="238" y="248" width="170" height="1" fill="#af9da4"/>
'''+label(238,237,'A MODERN FLORAL STUDIO',13,'#8d717f',weight='bold',extra='letter-spacing="3"')+label(238,358,'Flowers that',68,'#69515f','Georgia')+label(238,433,'speak from',68,'#69515f','Georgia')+label(238,510,'the heart.',75,'#a77d92','Georgia',extra='font-style="italic"')+label(240,580,'Thoughtful arrangements, beautifully presented.',18,'#8f7981')+'''
<rect x="238" y="623" width="214" height="54" fill="#6c5564"/>'''+label(270,656,'EXPLORE FLOWERS',13,'#fff',weight='bold',extra='letter-spacing="1.8"')+label(212,773,'FEATURED COLLECTIONS',15,'#897781',weight='bold',extra='letter-spacing="3"')
svg('flower-store.svg',b,'#ded1d7')

# smart bin
b='''<circle cx="1210" cy="140" r="315" fill="#e9d0a4"/><circle cx="120" cy="780" r="340" fill="#ccbc9f" opacity=".5"/>
<rect x="120" y="65" width="1200" height="740" rx="8" fill="#f8f1e4"/>
'''+label(179,133,'PROTOTYPE  /  05',14,'#a58d68',weight='bold',extra='letter-spacing="3"')+label(177,220,'SMART',80,'#343c36',weight='bold')+label(177,312,'TRASH BIN',80,'#343c36',weight='bold')+label(183,365,'ARDUINO UNO  /  HARDWARE EXPERIMENT',16,'#8d856f',weight='bold',extra='letter-spacing="2"')+'''
<line x1="180" y1="397" x2="720" y2="397" stroke="#bfb6a1"/>
'''+label(180,443,'A practical automation concept',21,'#7c7668','Georgia')+label(180,471,'powered by simple electronics.',21,'#7c7668','Georgia')+'''
<path d="M895 320 L1162 320 L1126 694 L926 694Z" fill="#5d7770" stroke="#3c584f" stroke-width="9"/>
<path d="M864 310 Q865 284 891 284 H1169 Q1197 284 1197 310 V336 H864 Z" fill="#33453f"/>
<path d="M909 300 Q930 250 974 250 H1083 Q1139 250 1157 300" fill="none" stroke="#718d7f" stroke-width="13"/>
<rect x="982" y="402" width="95" height="37" rx="8" fill="#38574d"/>
<circle cx="1007" cy="419" r="10" fill="#b3cfc0"/><circle cx="1054" cy="419" r="10" fill="#b3cfc0"/>
<path d="M1016 440 L1016 480 L1112 526" fill="none" stroke="#bc8d60" stroke-width="3" stroke-dasharray="10 8"/>
<rect x="702" y="559" width="170" height="113" rx="10" fill="#2d6c6d" stroke="#1d5458" stroke-width="4"/>
'''+label(715,580,'UNO',18,'#e0ffff',weight='bold')+'''
<rect x="730" y="598" width="71" height="43" rx="4" fill="#183b42"/>
<g fill="#cfa969"><rect x="714" y="549" width="7" height="9"/><rect x="731" y="549" width="7" height="9"/><rect x="748" y="549" width="7" height="9"/><rect x="765" y="549" width="7" height="9"/><rect x="782" y="549" width="7" height="9"/><rect x="799" y="549" width="7" height="9"/></g>
<path d="M872 611 Q905 590 920 481" fill="none" stroke="#bb9066" stroke-width="3" stroke-dasharray="9 8"/>
'''+label(181,683,'INPUT',15,'#b3865e',weight='bold')+label(181,708,'SENSOR',18,'#53594c',weight='bold')+label(328,683,'LOGIC',15,'#b3865e',weight='bold')+label(328,708,'CONTROLLER',18,'#53594c',weight='bold')+label(511,683,'OUTPUT',15,'#b3865e',weight='bold')+label(511,708,'ACTION',18,'#53594c',weight='bold')
svg('smart-bin.svg',b,'#e0d0b5')

# appointment
b='''<circle cx="30" cy="95" r="300" fill="#c8d9e5"/><circle cx="1370" cy="790" r="390" fill="#b3cad9" opacity=".55"/>
<rect x="145" y="58" width="1150" height="750" rx="12" fill="#7a9bab" opacity=".18" transform="translate(13 14)"/>
<rect x="145" y="58" width="1150" height="750" rx="12" fill="#f8fafb"/>
<path d="M157 58 H386 V808 H157 Q145 808 145 796 V70 Q145 58 157 58" fill="#293d4e"/>
'''+label(190,114,'Barangay',28,'#fff',weight='bold')+label(193,148,'SERVICE PORTAL',13,'#9cb6c6',weight='bold',extra='letter-spacing="2"')
for i,t in enumerate(['Dashboard','Appointments','Available dates','Residents','Services']):
 y=231+i*76
 if i==1:b+=f'<rect x="168" y="{y-31}" width="195" height="54" rx="8" fill="#496276"/>'
 b+=f'<circle cx="196" cy="{y-6}" r="8" fill="#8ab3c7"/>'+label(216,y,t,17,'#eef7fc' if i==1 else '#b0c2cf')
b+=label(438,119,'BOOK AN APPOINTMENT',14,'#859aaa',weight='bold',extra='letter-spacing="2"')+label(438,174,'Choose a convenient schedule.',34,'#2a3c4b',weight='bold')+'''
<rect x="438" y="211" width="505" height="516" rx="14" fill="#fff" stroke="#e0e8ec"/>
'''+label(475,261,'OCTOBER 2026',20,'#334c5d',weight='bold')+label(841,261,'‹     ›',30,'#607b8d')
for i,d in enumerate(['S','M','T','W','T','F','S']):b+=label(481+i*65,314,d,14,'#8fa1ad',weight='bold')
for i in range(35):
 row,col=divmod(i,7);day=i-3
 if 1<=day<=31:
  x=482+col*65;y=365+row*65
  if day==15:b+=f'<rect x="{x-18}" y="{y-30}" width="55" height="53" rx="9" fill="#567b94"/>'
  b+=label(x,y,str(day),17,'#fff' if day==15 else '#4b6474',weight='bold' if day==15 else 'normal')
b+='''<rect x="964" y="211" width="285" height="516" rx="14" fill="#e9f1f5"/>'''+label(997,261,'AVAILABLE SLOTS',18,'#334c5d',weight='bold')+label(997,297,'October 15, Thursday',14,'#8499a8')
for i,t in enumerate(['09:00 AM','10:30 AM','01:00 PM','02:30 PM']):
 y=341+i*76
 b+=f'<rect x="991" y="{y}" width="232" height="56" rx="8" fill="{("#567b94" if i==1 else "#fff")}" stroke="#dce7ed"/>'+label(1043,y+35,t,16,'#fff' if i==1 else '#537083',weight='bold')
b+='''<rect x="991" y="664" width="232" height="43" rx="7" fill="#324e63"/>'''+label(1043,691,'CONTINUE  →',13,'#fff',weight='bold')
svg('appointment-system.svg',b,'#c5d7e4')

# OG cover (social preview illustration, no phantom site URL)
og='''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f1e9"/><path d="M50 50H1150V580H50Z" fill="none" stroke="#cfcbc1"/>
<text x="104" y="125" font-family="Arial" font-weight="bold" letter-spacing="4" font-size="17" fill="#9b8375">PORTFOLIO / 2026</text>
<text x="102" y="291" font-family="Arial" font-weight="500" letter-spacing="-6" font-size="105" fill="#20201d">Digital by design.</text>
<text x="100" y="403" font-family="Georgia" font-style="italic" letter-spacing="-4" font-size="102" fill="#ac846c">Made to work.</text>
<path d="M100 473H1100" stroke="#c8c0b5"/><text x="104" y="529" font-family="Arial" letter-spacing="4" font-size="19" fill="#48413a">JERICO IBALIN  /  WEB DEVELOPER &amp; DIGITAL CREATIVE</text>
<text x="1042" y="116" font-family="Georgia" font-size="55" fill="#b48f78">✳</text>
</svg>'''
(Path(__file__).parent/'public'/'og-preview.svg').write_text(og)
print('Generated:',*[x.name for x in sorted(p.glob('*.svg'))],sep='\n- ')
