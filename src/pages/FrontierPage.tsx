import { useEffect, useState } from 'react'
import { experience, profile, skillGroups } from '../data/content'
import { frontierResume } from '../data/frontierResume'
import './frontier.css'

const chapters = [
  {
    id: 'silicon', number: '01', name: 'Semiconductors', short: 'Silicon', field: 'FROM MATERIAL TO DEVICE',
    headline: <>The world<br />inside a <em>chip.</em></>,
    description: 'Semiconductor materials sit between conductor and insulator. Carefully controlled doping creates regions; join p-type and n-type material and a junction emerges—the foundation of diodes and a gateway to transistor physics.',
    sequence: ['Material', 'Doping', 'Junction', 'Device'],
    takeaway: 'A tiny material change can control current.',
    coordinate: 'Si · 14',
    kind: 'field',
  },
  {
    id: 'logic', number: '02', name: 'Digital logic', short: 'Logic', field: 'FROM SWITCH TO COMPUTATION',
    headline: <>Two states.<br /><em>Endless logic.</em></>,
    description: 'Transistors can act as switches. Combine them into logic gates, then combine gates into memory and arithmetic circuits. Digital systems turn voltage levels into symbols, decisions, and computation.',
    sequence: ['Transistor', 'Logic gate', 'State', 'Compute'],
    takeaway: 'Complex behavior can emerge from simple rules.',
    coordinate: '0 · 1 · CMOS',
    kind: 'field',
  },
  {
    id: 'embedded', number: '03', name: 'Embedded systems', short: 'Embedded', field: 'FROM CODE TO THE PHYSICAL WORLD',
    headline: <>Small board.<br /><em>Big purpose.</em></>,
    description: 'A microcontroller combines a processor, memory, and peripherals. Firmware coordinates inputs and outputs—reading a sensor, applying a rule, and controlling an actuator within the device’s constraints.',
    sequence: ['Sense', 'Process', 'Decide', 'Act'],
    takeaway: 'Hardware makes software tangible.',
    coordinate: 'MCU · I/O',
    kind: 'field',
  },
  {
    id: 'signals', number: '04', name: 'Signals & DSP', short: 'Signals', field: 'FROM ANALOG REALITY TO DIGITAL DATA',
    headline: <>Make the<br />invisible <em>move.</em></>,
    description: 'Real-world signals change continuously. An analog-to-digital converter samples and quantizes them; digital signal processing can then filter noise, reveal patterns, or extract useful information.',
    sequence: ['Signal', 'Sample', 'Filter', 'Interpret'],
    takeaway: 'Sampling turns a changing world into data.',
    coordinate: 'Hz · ADC',
    kind: 'field',
  },
  {
    id: 'communications', number: '05', name: 'Communication', short: 'Comms', field: 'FROM MESSAGE TO RECEIVED SIGNAL',
    headline: <>Across the<br /><em>distance.</em></>,
    description: 'A communication system encodes information, sends it through a channel, and reconstructs it at the receiver. Modulation helps carry a message; noise, bandwidth, and power shape what arrives.',
    sequence: ['Encode', 'Transmit', 'Channel', 'Receive'],
    takeaway: 'A connection is a system, not just a signal.',
    coordinate: 'TX · RX',
    kind: 'field',
  },
  {
    id: 'control', number: '06', name: 'Control systems', short: 'Control', field: 'FROM MEASUREMENT TO RESPONSE',
    headline: <>Notice the change.<br /><em>Correct the course.</em></>,
    description: 'A feedback controller compares a measured output with a desired setpoint. The difference—the error—guides a control action, and a sensor reports what happened next.',
    sequence: ['Setpoint', 'Compare', 'Correct', 'Feedback'],
    takeaway: 'Feedback helps a system respond to change.',
    coordinate: 'INPUT · LOOP',
    kind: 'field',
  },
  {
    id: 'software', number: '07', name: 'Software systems', short: 'Software', field: 'FROM ENGINEERING FOUNDATION TO MY WORK',
    headline: <>The layers meet<br /><em>in software.</em></>,
    description: 'ECE is a powerful way to think across signals, devices, and systems. My professional work today is in full-stack Java development: connecting application interfaces, backend services, APIs, and data.',
    sequence: ['Interface', 'Service', 'API', 'Data'],
    takeaway: `${profile.role} · professional experience at ${experience[0].org}.`,
    coordinate: 'JAVA · FULL STACK',
    kind: 'professional',
  },
  {
    id: 'denoising',
    number: '08', name: 'Image denoising', short: 'Denoising', field: 'PROJECT · DIGITAL IMAGE PROCESSING',
    headline: <>Find the signal<br /><em>in the noise.</em></>,
    description: 'An image-processing project exploring flow-based denoising without paired clean/noisy examples.',
    sequence: ['Image', 'Motion', 'Optical flow', 'Denoise'],
    takeaway: 'A computer-vision project from the ECE portfolio.',
    coordinate: 'PROJECT · 2023',
    kind: 'resume',
  },
  {
    id: 'phone-detector',
    number: '09', name: 'LM358 detector', short: 'LM358', field: 'PROJECT · ANALOG ELECTRONICS',
    headline: <>Detect the<br /><em>nearby signal.</em></>,
    description: 'An analog circuit project using the LM358 operational amplifier to detect electromagnetic interference associated with nearby mobile phones.',
    sequence: ['Interference', 'LM358', 'Circuit', 'Alert'],
    takeaway: 'No measured accuracy or specific application was supplied.',
    coordinate: 'PROJECT · 2024',
    kind: 'resume',
  },
  {
    id: 'internships',
    number: '10', name: 'Virtual internships', short: 'Internships', field: 'PRACTICE · TWO VIRTUAL PROGRAMS',
    headline: <>From firmware<br /><em>to silicon.</em></>,
    description: 'Two virtual internship experiences connected embedded development with VLSI design and verification.',
    sequence: ['Embedded C/C++', 'UART · SPI', 'RTL', 'Verification'],
    takeaway: 'Both experiences are identified as virtual internships.',
    coordinate: 'EDUSKILLS · SKILLDZIRE',
    kind: 'resume',
  },
  {
    id: 'education',
    number: '11', name: 'Education', short: 'Education', field: 'FOUNDATION · ELECTRONICS & COMMUNICATION',
    headline: <>A foundation<br /><em>in ECE.</em></>,
    description: 'My education spans Electronics and Communication Engineering, mathematics and sciences, and secondary school.',
    sequence: ['SSC', 'MPC', 'B.Tech', 'ECE'],
    takeaway: 'Mother Theresa Institute of Engineering and Technology · 2021–2025.',
    coordinate: 'PALAMANER · CHITTOOR',
    kind: 'resume',
  },
  {
    id: 'toolkit',
    number: '12', name: 'Skills & contact', short: 'Profile', field: 'TOOLKIT · LEARNING · CONNECT',
    headline: <>Build, test,<br /><em>connect.</em></>,
    description: 'A practical toolkit across circuit design, embedded systems, troubleshooting, and analog and digital electronics.',
    sequence: ['Design', 'Develop', 'Test', 'Learn'],
    takeaway: 'TCS iON Career Edge – Young Professional · October 2023.',
    coordinate: 'CHITTOOR · INDIA',
    kind: 'resume',
  },
] as const

function ChipIllustration() {
  return (
    <svg className="frontier-svg frontier-chip" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="chip-shell" x1="120" y1="95" x2="500" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#354669" />
          <stop offset=".48" stopColor="#141d31" />
          <stop offset="1" stopColor="#39233f" />
        </linearGradient>
        <linearGradient id="chip-light" x1="155" y1="110" x2="480" y2="410" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" />
          <stop offset=".52" stopColor="#B6A4FF" />
          <stop offset="1" stopColor="#FF9B74" />
        </linearGradient>
        <filter id="chip-glow" x="30" y="12" width="580" height="500" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <ellipse cx="320" cy="425" rx="208" ry="38" fill="#05070D" opacity=".8" />
      <g className="frontier-chip-glow" filter="url(#chip-glow)" opacity=".55">
        <path d="M197 111h246l103 103v192l-103 61H197L94 406V214l103-103Z" stroke="url(#chip-light)" strokeWidth="13" />
      </g>
      <path d="m193 91 250 0 105 105v203l-105 59H193L88 399V196L193 91Z" fill="url(#chip-shell)" stroke="#647A9D" strokeWidth="2" />
      <path d="m211 121 213 0 93 93v159l-93 54H211l-93-54V214l93-93Z" fill="#0B1120" stroke="url(#chip-light)" strokeOpacity=".7" strokeWidth="2" />
      <path d="m250 166 136 0 60 60v115l-60 35H250l-59-35V226l59-60Z" fill="#121D30" stroke="#455A7B" strokeWidth="2" />
      <path d="m276 195 84 0 36 36v75l-36 20h-84l-36-20v-75l36-36Z" fill="#08101C" stroke="url(#chip-light)" strokeWidth="2" />
      <path d="M292 216h51l21 21v44l-21 17h-51l-20-17v-44l20-21Z" fill="#142636" stroke="#7DE4DF" strokeOpacity=".82" strokeWidth="2" />
      <path d="M307 235h21v28h-21z" fill="#7DE4DF" opacity=".86" className="frontier-core-light" />
      <path d="M319 94V42m37 52V28m37 66V45m37 54V35M319 456v50m37-50v36m37-36v51m37-53v36M90 228H39m49 39H20m68 38H42m46 38H25m485-115h54m-54 39h72m-72 38h51m-51 38h69" stroke="url(#chip-light)" strokeWidth="3" strokeLinecap="round" />
      <path d="M39 228h77m-96 39h100m-78 38h78m-91 38h91m394-115h54m-54 39h72m-72 38h51m-51 38h69M319 42v53m37-67v66m37-49v70m37-80v82m-148 356v-51m37 37v-36m37 51v-52m37 35v-36" stroke="#7DE4DF" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="3 7" className="frontier-circuit-flow" />
      <circle cx="125" cy="150" r="4" fill="#FFB180" className="frontier-led" />
      <circle cx="491" cy="165" r="4" fill="#7DE4DF" className="frontier-led frontier-led-two" />
      <circle cx="461" cy="390" r="4" fill="#B6A4FF" className="frontier-led frontier-led-three" />
      <text x="320" y="365" textAnchor="middle" fill="#9EACC4" fontFamily="monospace" fontSize="10" letterSpacing="4">SILICON / SIGNAL / SCALE</text>
    </svg>
  )
}

function BoardIllustration() {
  return (
    <svg className="frontier-svg frontier-board" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="board-base" x1="120" y1="95" x2="510" y2="455" gradientUnits="userSpaceOnUse">
          <stop stopColor="#163D3A" />
          <stop offset=".55" stopColor="#102C2B" />
          <stop offset="1" stopColor="#182339" />
        </linearGradient>
        <filter id="board-glow" x="70" y="50" width="510" height="430" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <ellipse cx="320" cy="443" rx="211" ry="35" fill="#03090D" opacity=".75" />
      <g className="frontier-board-aura" filter="url(#board-glow)" opacity=".55">
        <rect x="110" y="78" width="420" height="358" rx="38" stroke="#62E4C0" strokeWidth="13" />
      </g>
      <rect x="105" y="72" width="430" height="366" rx="34" fill="url(#board-base)" stroke="#76D9B3" strokeOpacity=".8" strokeWidth="2" />
      <path d="M128 98h384v316H128z" stroke="#61B79D" strokeOpacity=".3" strokeWidth="1" />
      <path d="M131 163h88v80h-88zm290-45h79v71h-79zm-10 222h91v47h-91zM151 334h62v50h-62z" fill="#0A171B" stroke="#65DDB4" strokeOpacity=".55" strokeWidth="2" />
      <rect x="238" y="164" width="166" height="172" rx="15" fill="#101A26" stroke="#A9A1FF" strokeWidth="2" />
      <rect x="263" y="188" width="116" height="124" rx="9" fill="#141E2B" stroke="#596D90" />
      <path d="M283 215h76m-76 21h49m-49 21h67m-67 21h39" stroke="#89EAD0" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      <text x="321" y="301" textAnchor="middle" fill="#B8AAFF" fontFamily="monospace" fontSize="9" letterSpacing="2">CONTROL</text>
      <path d="M219 181h19m-19 22h19m-19 22h19m166-44h19m-19 22h19m-19 22h19m-19 22h19m-19 22h19m-19 22h19M278 164v-15m22 15v-15m22 15v-15m22 15v-15m22 15v-15m-88 187v15m22-15v15m22-15v15m22-15v15m22-15v15" stroke="#C1B5FF" strokeWidth="3" strokeLinecap="round" />
      <path d="M151 203h43v42h-43zm282-65h54v41h-54zm-7 223h68v24h-68zm-260-15h42v25h-42z" fill="#7DE4DF" fillOpacity=".08" stroke="#7DE4DF" strokeOpacity=".35" />
      <path d="m173 223 18-18m-18 18h16m268-67h22m-22 8h15m-20 185h37m-37 7h26m-284-13h26m-26 7h18" stroke="#7DE4DF" strokeWidth="1.5" strokeLinecap="round" className="frontier-circuit-flow" />
      <circle cx="157" cy="118" r="5" fill="#7DE4DF" className="frontier-led" /><circle cx="483" cy="385" r="5" fill="#FFB180" className="frontier-led frontier-led-two" />
      <circle cx="207" cy="293" r="5" fill="#B6A4FF" className="frontier-led frontier-led-three" />
      <path d="M87 147h18m430 164h18m-369 145v20m169-404V54" stroke="#FFB180" strokeWidth="3" strokeLinecap="round" />
      <circle cx="96" cy="147" r="5" fill="#FFB180" /><circle cx="544" cy="311" r="5" fill="#FFB180" />
    </svg>
  )
}

function SignalIllustration() {
  return (
    <svg className="frontier-svg frontier-signal" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="signal-line" x1="98" y1="280" x2="551" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" />
          <stop offset=".5" stopColor="#B6A4FF" />
          <stop offset="1" stopColor="#FF9B74" />
        </linearGradient>
        <filter id="signal-glow" x="32" y="96" width="570" height="364" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect x="73" y="102" width="494" height="310" rx="25" fill="#0B111E" stroke="#596581" strokeOpacity=".8" strokeWidth="2" />
      <path d="M110 158h420M110 215h420M110 272h420M110 329h420M110 386h420M152 139v236m84-236v236m84-236v236m84-236v236m84-236v236" stroke="#7886A3" strokeOpacity=".14" />
      <path d="M99 270h452" stroke="#A4AFC2" strokeOpacity=".22" strokeDasharray="4 8" />
      <path className="frontier-wave-glow" d="M98 272h51l16-9 13 14 22-4 18-2 17-64 17 111 19-87 21 41 16-9 20 9h43l14-6 15 3 19-76 17 119 20-91 19 43 15 7h55" stroke="url(#signal-line)" strokeWidth="10" filter="url(#signal-glow)" opacity=".6" />
      <path className="frontier-wave" d="M98 272h51l16-9 13 14 22-4 18-2 17-64 17 111 19-87 21 41 16-9 20 9h43l14-6 15 3 19-76 17 119 20-91 19 43 15 7h55" stroke="url(#signal-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="252" cy="207" r="6" fill="#B6A4FF" className="frontier-signal-point" />
      <circle cx="425" cy="198" r="6" fill="#FF9B74" className="frontier-signal-point frontier-signal-point-two" />
      <path d="M111 126h34m13 0h8" stroke="#7DE4DF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="516" cy="126" r="4" fill="#7DE4DF" className="frontier-led" />
      <text x="108" y="443" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">INPUT</text>
      <text x="480" y="443" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">RESPONSE</text>
      <path d="M112 463h416" stroke="#46516B" strokeWidth="1" />
      <path d="M112 463h184" stroke="url(#signal-line)" strokeWidth="2" className="frontier-signal-progress" />
    </svg>
  )
}

function LogicIllustration() {
  return (
    <svg className="frontier-svg frontier-logic" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logic-flow" x1="120" y1="260" x2="526" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" />
          <stop offset=".52" stopColor="#B6A4FF" />
          <stop offset="1" stopColor="#FFB180" />
        </linearGradient>
        <filter id="logic-glow" x="85" y="95" width="480" height="340" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <path d="M92 149h142m-142 220h142m143-110h165" stroke="url(#logic-flow)" strokeWidth="3" strokeDasharray="5 8" className="frontier-circuit-flow" />
      <path d="M230 149h46c38 0 39 90 83 90m-129 130h46c38 0 39-90 83-90" stroke="#7DE4DF" strokeOpacity=".35" strokeWidth="2" />
      <g filter="url(#logic-glow)" opacity=".55"><path d="M338 187h48c58 0 92 32 92 73s-34 73-92 73h-48l32-73-32-73Z" stroke="#B6A4FF" strokeWidth="10" /></g>
      <path d="M338 187h48c58 0 92 32 92 73s-34 73-92 73h-48l32-73-32-73Z" fill="#14182A" stroke="url(#logic-flow)" strokeWidth="2" />
      <text x="400" y="266" textAnchor="middle" fill="#E8E3FF" fontFamily="monospace" fontSize="18" letterSpacing="2">AND</text>
      <circle cx="92" cy="149" r="13" fill="#102628" stroke="#7DE4DF" strokeWidth="2" /><circle cx="92" cy="369" r="13" fill="#102628" stroke="#7DE4DF" strokeWidth="2" />
      <text x="92" y="153" textAnchor="middle" fill="#B5FFF3" fontFamily="monospace" fontSize="8">A</text><text x="92" y="373" textAnchor="middle" fill="#B5FFF3" fontFamily="monospace" fontSize="8">B</text>
      <rect x="512" y="234" width="56" height="52" rx="13" fill="#29213A" stroke="#FFB180" strokeWidth="2" />
      <text x="540" y="265" textAnchor="middle" fill="#FFE0C3" fontFamily="monospace" fontSize="18">1</text>
      <path d="M117 149h72m-72 220h72m265-177v24m0 146v-24" stroke="url(#logic-flow)" strokeWidth="2" strokeDasharray="3 7" className="frontier-circuit-flow" />
      <circle cx="190" cy="149" r="5" fill="#7DE4DF" className="frontier-led" /><circle cx="190" cy="369" r="5" fill="#7DE4DF" className="frontier-led frontier-led-two" />
      <text x="320" y="448" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="10" letterSpacing="4">SWITCHES → RULES → COMPUTATION</text>
    </svg>
  )
}

function CommunicationIllustration() {
  return (
    <svg className="frontier-svg frontier-communication" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="radio-wave" x1="149" y1="252" x2="492" y2="252" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" /><stop offset=".55" stopColor="#B6A4FF" /><stop offset="1" stopColor="#FF9B74" />
        </linearGradient>
        <filter id="radio-glow" x="64" y="91" width="510" height="355" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>
      <path d="M128 351h384" stroke="#65738B" strokeOpacity=".35" />
      <path d="M178 340V202m-37 139h74m-60-144 23-39 23 39m-42 0h38" stroke="#7DE4DF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M462 340V202m-37 139h74m-60-144 23-39 23 39m-42 0h38" stroke="#FF9B74" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M196 247c32-49 61 49 93 0s61 49 93 0 60 49 82 0" stroke="url(#radio-wave)" strokeWidth="10" opacity=".45" filter="url(#radio-glow)" />
      <path d="M196 247c32-49 61 49 93 0s61 49 93 0 60 49 82 0" stroke="url(#radio-wave)" strokeWidth="3" strokeLinecap="round" className="frontier-wave" />
      <path d="m210 213 28 34-28 34m250-68-28 34 28 34" stroke="url(#radio-wave)" strokeWidth="1.5" strokeDasharray="3 6" opacity=".7" className="frontier-circuit-flow" />
      <rect x="261" y="328" width="118" height="45" rx="12" fill="#151B2C" stroke="#B6A4FF" strokeOpacity=".65" />
      <text x="320" y="355" textAnchor="middle" fill="#DCD4FF" fontFamily="monospace" fontSize="10" letterSpacing="2">CHANNEL</text>
      <circle cx="178" cy="163" r="5" fill="#7DE4DF" className="frontier-led" /><circle cx="462" cy="163" r="5" fill="#FF9B74" className="frontier-led frontier-led-two" />
      <text x="178" y="406" textAnchor="middle" fill="#9FECE0" fontFamily="monospace" fontSize="10" letterSpacing="2">TRANSMIT</text>
      <text x="462" y="406" textAnchor="middle" fill="#FFC1A5" fontFamily="monospace" fontSize="10" letterSpacing="2">RECEIVE</text>
      <circle cx="320" cy="247" r="5" fill="#FFF" className="frontier-signal-point" />
      <path d="M101 441h438" stroke="#48546D" strokeWidth="1" /><path d="M101 441h213" stroke="url(#radio-wave)" strokeWidth="2" className="frontier-signal-progress" />
    </svg>
  )
}

function SystemsIllustration() {
  return (
    <svg className="frontier-svg frontier-systems" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="system-core" cx="0" cy="0" r="1" gradientTransform="matrix(0 128 -128 0 321 262)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#385D67" />
          <stop offset="1" stopColor="#101622" />
        </radialGradient>
      </defs>
      <circle cx="321" cy="262" r="160" fill="#0A101A" stroke="#52617F" strokeOpacity=".4" strokeDasharray="3 9" />
      <circle cx="321" cy="262" r="119" stroke="#7DE4DF" strokeOpacity=".18" />
      <circle cx="321" cy="262" r="79" stroke="#B6A4FF" strokeOpacity=".27" strokeDasharray="3 7" />
      <path d="m321 262-131-102m131 102 139-95m-139 95 117 113m-117-113-146 107m146-107 8-149" stroke="#8F9AB7" strokeOpacity=".48" strokeDasharray="4 7" />
      <circle cx="321" cy="262" r="48" fill="url(#system-core)" stroke="#7DE4DF" strokeOpacity=".85" strokeWidth="2" />
      <circle cx="321" cy="262" r="28" fill="#111A29" stroke="#B6A4FF" strokeOpacity=".65" />
      <text x="321" y="267" textAnchor="middle" fill="#E5F8F3" fontFamily="monospace" fontSize="12" letterSpacing="2">SYSTEM</text>
      <g className="frontier-system-node frontier-system-node-one"><circle cx="190" cy="160" r="30" fill="#14252F" stroke="#7DE4DF" strokeWidth="2" /><path d="M180 160h20m-10-10v20" stroke="#7DE4DF" strokeWidth="2" /></g>
      <g className="frontier-system-node frontier-system-node-two"><circle cx="460" cy="167" r="30" fill="#1D1930" stroke="#B6A4FF" strokeWidth="2" /><path d="M450 167h20m-10-10v20" stroke="#B6A4FF" strokeWidth="2" /></g>
      <g className="frontier-system-node frontier-system-node-three"><circle cx="438" cy="375" r="30" fill="#2A1C22" stroke="#FF9B74" strokeWidth="2" /><path d="M428 375h20m-10-10v20" stroke="#FF9B74" strokeWidth="2" /></g>
      <g className="frontier-system-node frontier-system-node-four"><circle cx="175" cy="369" r="30" fill="#172B27" stroke="#A9E9B1" strokeWidth="2" /><path d="M165 369h20m-10-10v20" stroke="#A9E9B1" strokeWidth="2" /></g>
      <circle cx="329" cy="113" r="23" fill="#2A1F2C" stroke="#FFB180" strokeWidth="2" /><path d="M320 113h18m-9-9v18" stroke="#FFB180" strokeWidth="2" />
      <circle cx="321" cy="262" r="5" fill="white" className="frontier-led" />
      <text x="320" y="466" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">COMPONENTS / CONNECTIONS / OUTCOMES</text>
    </svg>
  )
}

function ControlIllustration() {
  return (
    <svg className="frontier-svg frontier-control" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="control-flow" x1="104" y1="256" x2="535" y2="256" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" /><stop offset=".55" stopColor="#B6A4FF" /><stop offset="1" stopColor="#FFB180" />
        </linearGradient>
        <filter id="control-glow" x="80" y="104" width="490" height="306" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <path d="M102 203h67m0 0 30-42v84l-30-42Zm97 0h50m69 0h56m92 0h75v118H256v-78" stroke="url(#control-flow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="250" y="167" width="72" height="72" rx="13" fill="#151D30" stroke="#B6A4FF" strokeWidth="2" />
      <text x="286" y="209" textAnchor="middle" fill="#E5DEFF" fontFamily="monospace" fontSize="18">Σ</text>
      <rect x="374" y="175" width="94" height="57" rx="12" fill="#122420" stroke="#7DE4DF" strokeWidth="2" />
      <text x="421" y="209" textAnchor="middle" fill="#C5FFF1" fontFamily="monospace" fontSize="11" letterSpacing="1">PLANT</text>
      <circle cx="169" cy="203" r="5" fill="#7DE4DF" className="frontier-led" />
      <path d="M101 345h65m0 0 25-42v84l-25-42Zm90 0h43" stroke="#FFB180" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="240" y="317" width="110" height="56" rx="12" fill="#251C20" stroke="#FFB180" strokeWidth="2" />
      <text x="295" y="351" textAnchor="middle" fill="#FFE0C9" fontFamily="monospace" fontSize="10" letterSpacing="1">SENSOR</text>
      <circle cx="201" cy="345" r="5" fill="#FFB180" className="frontier-led frontier-led-two" />
      <path d="M101 112h438" stroke="#64718B" strokeOpacity=".18" strokeDasharray="3 8" />
      <path d="M107 203h52m-51 142h51" stroke="url(#control-flow)" strokeWidth="8" opacity=".25" filter="url(#control-glow)" />
      <path d="M421 232v79" stroke="#7DE4DF" strokeWidth="2" strokeDasharray="4 7" className="frontier-circuit-flow" />
      <circle cx="421" cy="311" r="5" fill="#7DE4DF" className="frontier-led frontier-led-three" />
      <text x="320" y="433" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="10" letterSpacing="3">SETPOINT → ERROR → RESPONSE → FEEDBACK</text>
    </svg>
  )
}

function DenoiseIllustration() {
  return (
    <svg className="frontier-svg frontier-denoise-art" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="denoise-flow" x1="152" y1="260" x2="489" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" /><stop offset=".55" stopColor="#B6A4FF" /><stop offset="1" stopColor="#FF9B74" />
        </linearGradient>
        <filter id="denoise-glow" x="170" y="130" width="300" height="270" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <rect x="76" y="142" width="174" height="212" rx="18" fill="#101825" stroke="#71819B" strokeOpacity=".7" />
      <rect x="390" y="142" width="174" height="212" rx="18" fill="#101825" stroke="#7DE4DF" strokeOpacity=".65" />
      <path d="M93 159h140v178H93z" fill="#151F2E" />
      <path d="M407 159h140v178H407z" fill="#13252A" />
      <g fill="#B6A4FF">
        <circle cx="112" cy="181" r="3" /><circle cx="142" cy="201" r="3" /><circle cx="181" cy="177" r="3" /><circle cx="218" cy="217" r="3" />
        <circle cx="121" cy="253" r="3" /><circle cx="165" cy="235" r="3" /><circle cx="203" cy="276" r="3" /><circle cx="104" cy="310" r="3" />
        <circle cx="143" cy="295" r="3" /><circle cx="188" cy="319" r="3" /><circle cx="223" cy="291" r="3" />
      </g>
      <path d="M130 288c26-77 68-77 95 0" stroke="#FFB180" strokeWidth="2" strokeDasharray="4 7" />
      <path d="M405 272c28-54 70-54 98 0" stroke="#7DE4DF" strokeWidth="4" />
      <circle cx="437" cy="227" r="7" fill="#B6A4FF" className="frontier-signal-point" />
      <circle cx="480" cy="227" r="7" fill="#FF9B74" className="frontier-signal-point frontier-signal-point-two" />
      <path d="M261 247h117m-23-23 23 23-23 23" stroke="url(#denoise-flow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M270 247h94" stroke="url(#denoise-flow)" strokeWidth="10" opacity=".3" filter="url(#denoise-glow)" />
      <text x="163" y="386" textAnchor="middle" fill="#AEBBD0" fontFamily="monospace" fontSize="10" letterSpacing="2">NOISY INPUT</text>
      <text x="477" y="386" textAnchor="middle" fill="#9FECE0" fontFamily="monospace" fontSize="10" letterSpacing="2">FLOW-BASED OUTPUT</text>
      <text x="320" y="436" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">MOTION ESTIMATION · OPTICAL FLOW</text>
    </svg>
  )
}

function DetectorIllustration() {
  return (
    <svg className="frontier-svg frontier-detector-art" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="detector-flow" x1="103" y1="264" x2="543" y2="264" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" /><stop offset=".56" stopColor="#B6A4FF" /><stop offset="1" stopColor="#FFB180" />
        </linearGradient>
        <filter id="detector-glow" x="76" y="125" width="500" height="290" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <path d="M90 254h130m105 0h95m50 0h78" stroke="url(#detector-flow)" strokeWidth="3" />
      <path d="M90 254h130m105 0h95m50 0h78" stroke="url(#detector-flow)" strokeWidth="10" opacity=".27" filter="url(#detector-glow)" />
      <path d="m220 169 105 85-105 85V169Z" fill="#171B2D" stroke="#B6A4FF" strokeWidth="2" />
      <text x="267" y="249" textAnchor="middle" fill="#E5DEFF" fontFamily="monospace" fontSize="15">LM358</text>
      <path d="M220 207h-32m32 94h-32m-14-47h14m-14-12v24" stroke="#B6A4FF" strokeWidth="2" />
      <text x="210" y="196" textAnchor="end" fill="#AEBBD0" fontFamily="monospace" fontSize="10">+</text>
      <text x="210" y="293" textAnchor="end" fill="#AEBBD0" fontFamily="monospace" fontSize="10">−</text>
      <path d="M105 184c20 17 20 34 0 51m-17-68c35 28 35 58 0 86m420-52 24 24-24 24m25-54 30 30-30 30" stroke="#7DE4DF" strokeWidth="2" strokeLinecap="round" />
      <rect x="464" y="221" width="68" height="66" rx="15" fill="#201C2B" stroke="#FFB180" strokeWidth="2" />
      <path d="m486 252 12-15 12 15h-9l-3 15-3-15h-9Z" fill="#FFB180" />
      <circle cx="113" cy="254" r="6" fill="#7DE4DF" className="frontier-led" />
      <circle cx="499" cy="254" r="5" fill="#FFB180" className="frontier-led frontier-led-two" />
      <text x="128" y="356" textAnchor="middle" fill="#9FECE0" fontFamily="monospace" fontSize="10" letterSpacing="2">EM INTERFERENCE</text>
      <text x="499" y="326" textAnchor="middle" fill="#FFC1A5" fontFamily="monospace" fontSize="10" letterSpacing="2">ALERT</text>
      <text x="320" y="428" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">CONCEPTUAL CIRCUIT FLOW · NOT A SCHEMATIC</text>
    </svg>
  )
}

function InternshipIllustration() {
  return (
    <svg className="frontier-svg frontier-internship-art" viewBox="0 0 640 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="internship-link" x1="125" y1="260" x2="514" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DE4DF" /><stop offset="1" stopColor="#B6A4FF" />
        </linearGradient>
      </defs>
      <rect x="78" y="156" width="204" height="210" rx="22" fill="#10201F" stroke="#7DE4DF" strokeOpacity=".7" />
      <rect x="358" y="156" width="204" height="210" rx="22" fill="#19172A" stroke="#B6A4FF" strokeOpacity=".75" />
      <rect x="125" y="205" width="110" height="106" rx="12" fill="#121B27" stroke="#7DE4DF" strokeWidth="2" />
      <path d="M143 228h74m-74 19h53m-53 19h66m-66 19h41" stroke="#8DE9D4" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 205v-24m24 24v-24m-48 24v-24m24 130v24m24-24v24m-48-24v24M125 231h-22m22 24h-22m22 24h-22m132-48h22m-22 24h22m-22 24h22" stroke="#7DE4DF" strokeWidth="2" />
      <path d="M405 214h110v89H405z" fill="#111827" stroke="#B6A4FF" strokeWidth="2" />
      <path d="M426 234h68m-68 20h46m-46 20h59" stroke="#C9BCFF" strokeWidth="3" strokeLinecap="round" />
      <text x="180" y="343" textAnchor="middle" fill="#9FECE0" fontFamily="monospace" fontSize="10" letterSpacing="2">EMBEDDED</text>
      <text x="460" y="343" textAnchor="middle" fill="#DCD4FF" fontFamily="monospace" fontSize="10" letterSpacing="2">VLSI</text>
      <path d="M283 259h73m-17-17 17 17-17 17" stroke="url(#internship-link)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="320" cy="259" r="6" fill="#FFF" className="frontier-led" />
      <text x="320" y="422" textAnchor="middle" fill="#8997B1" fontFamily="monospace" fontSize="9" letterSpacing="3">FIRMWARE ↔ HARDWARE DESIGN</text>
    </svg>
  )
}

function ChapterVisual({ chapter }: { chapter: (typeof chapters)[number] }) {
  return (
    <div className={`frontier-visual frontier-visual-${chapter.id}`} aria-hidden="true">
      <div className="frontier-visual-grid" />
      <div className="frontier-visual-vignette" />
      {chapter.id === 'silicon' && <ChipIllustration />}
      {chapter.id === 'logic' && <LogicIllustration />}
      {chapter.id === 'embedded' && <BoardIllustration />}
      {chapter.id === 'signals' && <SignalIllustration />}
      {chapter.id === 'communications' && <CommunicationIllustration />}
      {chapter.id === 'control' && <ControlIllustration />}
      {chapter.id === 'software' && <SystemsIllustration />}
      {chapter.id === 'denoising' && <DenoiseIllustration />}
      {chapter.id === 'phone-detector' && <DetectorIllustration />}
      {chapter.id === 'internships' && <InternshipIllustration />}
      {(chapter.id === 'education' || chapter.id === 'toolkit') && <SystemsIllustration />}
      <span className="frontier-visual-caption">{chapter.number} / {chapter.field}</span>
      <span className="frontier-visual-coordinate">{chapter.coordinate}</span>
    </div>
  )
}

function ResumeChapterContent({ chapterId }: { chapterId: string }) {
  if (chapterId === 'denoising' || chapterId === 'phone-detector') {
    const project = frontierResume.projects.find((item) => item.id === chapterId)
    if (!project) return null

    return (
      <div className="frontier-resume-card">
        <div className="frontier-resume-card-heading">
          <strong>{project.title}</strong>
          <span>{project.date}</span>
        </div>
        <small>{project.focus}</small>
        <p>{project.summary}</p>
        <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        <div className="frontier-resume-tags">
          {project.technologies.map((technology) => <i key={technology}>{technology}</i>)}
        </div>
      </div>
    )
  }

  if (chapterId === 'internships') {
    return (
      <div className="frontier-resume-list">
        {frontierResume.internships.map((internship) => (
          <article className="frontier-resume-card" key={internship.title}>
            <div className="frontier-resume-card-heading">
              <strong>{internship.title}</strong>
              <span>{internship.date}</span>
            </div>
            <small>{internship.organization}</small>
            <p>{internship.description}</p>
            <ul>{internship.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            <div className="frontier-resume-tags">
              {internship.technologies.map((technology) => <i key={technology}>{technology}</i>)}
            </div>
          </article>
        ))}
      </div>
    )
  }

  if (chapterId === 'education') {
    return (
      <ol className="frontier-education-list">
        {frontierResume.education.map((item) => (
          <li key={item.institution}>
            <i aria-hidden="true" />
            <div>
              <strong>{item.degree} · {item.subject}</strong>
              <span>{item.institution}</span>
              <small>{item.date} · {item.place}</small>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  if (chapterId === 'toolkit') {
    const { certification, contact } = frontierResume
    return (
      <div className="frontier-profile-details">
        <div className="frontier-resume-skills" aria-label="Electronics and embedded skills">
          {frontierResume.skillGroups.map((group) => (
            <div key={group.name}>
              <strong>{group.name}</strong>
              <div className="frontier-resume-tags">
                {group.skills.map((skill) => <i key={skill}>{skill}</i>)}
              </div>
            </div>
          ))}
        </div>
        <article className="frontier-certification">
          <span>CERTIFICATION · {certification.date}</span>
          <strong>{certification.title}</strong>
          <small>{certification.issuer}</small>
          <p>{certification.topics.join(' · ')}</p>
        </article>
        <address className="frontier-contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          <a href="/resume.pdf" download>Download résumé ↓</a>
          <span>{contact.address}</span>
          <div>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </address>
      </div>
    )
  }

  return null
}

export function FrontierPage() {
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const index = chapters.findIndex((chapter) => chapter.id === visible?.target.id)
        if (index >= 0) setActiveChapter(index)
      },
      { threshold: [0.35, 0.6], rootMargin: '-15% 0px -15% 0px' },
    )

    document.querySelectorAll<HTMLElement>('.frontier-story-scene').forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('.frontier-story-scene'))

    const updateDepth = () => {
      frame = 0
      const viewport = window.innerHeight || 1
      for (const scene of scenes) {
        const bounds = scene.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (viewport - bounds.top) / (viewport + bounds.height)))
        const depth = (progress - .5) * -54
        scene.style.setProperty('--scroll-depth', `${depth.toFixed(1)}px`)
        scene.style.setProperty('--story-depth', `${(depth * -.23).toFixed(1)}px`)
        scene.style.setProperty('--back-depth', `${(depth * 1.8).toFixed(1)}px`)
        scene.style.setProperty('--grid-depth', `${(depth * -.42).toFixed(1)}px`)
        scene.style.setProperty('--scroll-progress', progress.toFixed(3))
      }
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDepth)
    }

    updateDepth()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <article className="frontier-page frontier-atlas" aria-label="ECE and software portfolio journey">
      <div className="frontier-atlas-backdrop" aria-hidden="true">
        <div className="frontier-atlas-grid" />
        <div className="frontier-atlas-beam" />
      </div>

      <header className="frontier-atlas-cover">
        <div className="frontier-cover-topline">
          <span>ECE + SOFTWARE PORTFOLIO <i>FIELD NOTES 01—12</i></span>
          <span>SEKHAR VISHAL <i>CHITTOOR, INDIA</i></span>
        </div>
        <div className="frontier-cover-art" aria-hidden="true">
          <div className="frontier-cover-orbit frontier-cover-orbit-one" />
          <div className="frontier-cover-orbit frontier-cover-orbit-two" />
          <div className="frontier-cover-core"><i /></div>
          <span>INPUT</span><span>TRANSFORM</span><span>OUTPUT</span>
        </div>
        <div className="frontier-cover-title">
          <span>ELECTRONICS · SYSTEMS · SOFTWARE</span>
          <h1>Between<br /><em>signal</em> &amp; system.</h1>
          <p>An ECE-to-software portfolio. Explore engineering ideas, projects, education, and professional experience one chapter at a time.</p>
        </div>
        <div className="frontier-cover-bottom">
          <span>12 FIELD STOPS · ONE CONTINUOUS TRACE</span>
          <div><i /> SCROLL TO BEGIN</div>
        </div>
      </header>

      <aside className="frontier-scroll-index" aria-label="Scroll progress">
        <span className="frontier-scroll-index-label">CURRENT TRACE</span>
        <strong>{String(activeChapter + 1).padStart(2, '0')}</strong>
        <i><b style={{ transform: `scaleY(${(activeChapter + 1) / chapters.length})` }} /></i>
        <span>{String(chapters.length).padStart(2, '0')}</span>
      </aside>

      {chapters.map((chapter, index) => (
        <section
          aria-labelledby={`${chapter.id}-title`}
          className={`frontier-story-scene frontier-scene-${chapter.id}${activeChapter === index ? ' is-active' : ''}`}
          id={chapter.id}
          key={chapter.id}
        >
          <div className="frontier-scene-topline">
            <span>{chapter.field}</span>
            <span>{chapter.coordinate}</span>
          </div>
          <div className="frontier-scene-backtype" aria-hidden="true">{chapter.number}</div>
          <div className="frontier-scene-visual">
            <div className="frontier-scene-visual-grid" aria-hidden="true" />
            <div className="frontier-kinetic-orbit frontier-kinetic-orbit-one" aria-hidden="true"><i /></div>
            <div className="frontier-kinetic-orbit frontier-kinetic-orbit-two" aria-hidden="true"><i /></div>
            <div className="frontier-kinetic-sweep" aria-hidden="true" />
            <div className="frontier-kinetic-particles" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className="frontier-visual-reticles" aria-hidden="true"><i /><i /><i /><i /></div>
            <ChapterVisual chapter={chapter} />
            <div className="frontier-kinetic-telemetry" aria-hidden="true">
              <span>FIG. {chapter.number}</span>
              <i />
              <span>{chapter.coordinate}</span>
            </div>
            <span className="frontier-scene-caption">{chapter.number} <i>/</i> {chapter.name}</span>
          </div>
          <div className="frontier-scene-story">
            <span className="frontier-scene-kicker">
              {chapter.kind === 'field' ? 'FIELD EXPLAINER' : chapter.kind === 'professional' ? 'PROFESSIONAL EXPERIENCE' : 'FROM MY RÉSUMÉ'}
            </span>
            <h2 id={`${chapter.id}-title`}>{chapter.headline}</h2>
            <p className="frontier-scene-description">{chapter.description}</p>
            <div className="frontier-signal-chain" aria-label={`${chapter.name} sequence`}>
              {chapter.sequence.map((step, stepIndex) => (
                <span key={step}><i>{String(stepIndex + 1).padStart(2, '0')}</i><b>{step}</b></span>
              ))}
            </div>
            {chapter.kind === 'field' ? (
              <span className="frontier-accuracy-note">GENERAL ENGINEERING CONCEPT · NOT A CLAIM OF PERSONAL HANDS-ON EXPERIENCE</span>
            ) : chapter.kind === 'professional' ? (
              <div className="frontier-professional-detail">
                <article className="frontier-career-card">
                  <span>CURRENT ROLE · FROM YOUR PROFILE</span>
                  <strong>{profile.role}</strong>
                  <small>{experience[0].org} · {experience[0].period}</small>
                  <p>{experience[0].bullets[1]}</p>
                </article>
                <div className="frontier-stack-groups" aria-label="Technologies in my professional toolkit">
                  {skillGroups.slice(0, 4).map((group) => (
                    <div className="frontier-stack-group" key={group.name}>
                      <span>{group.name}</span>
                      <p>{group.skills.slice(0, 5).map((skill) => <i key={skill}>{skill}</i>)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : <ResumeChapterContent chapterId={chapter.id} />}
            {chapter.takeaway && <span className="frontier-scene-takeaway">{chapter.takeaway}</span>}
          </div>
          <span className="frontier-scene-bottomline"><i>{String(index + 1).padStart(2, '0')}</i> / {String(chapters.length).padStart(2, '0')} <b>{chapter.field}</b></span>
        </section>
      ))}

      <footer className="frontier-atlas-end">
        <span>END OF TRACE</span>
        <strong>Curiosity connects the layers.</strong>
        <span className="frontier-end-caption">FIELD JOURNAL · ELECTRONICS · SYSTEMS · SOFTWARE</span>
      </footer>
    </article>
  )
}
