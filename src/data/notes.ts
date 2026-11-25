import type { ModuleId, NoteSection } from '../types';

/**
 * Every block below is derived only from the 11-page reviewer PDF.
 * Page references point to the source page where the material appears.
 */
export const NOTE_SECTIONS: NoteSection[] = [
  // ── Module 1 ──────────────────────────────────────────────────────────────
  {
    id: 'm1-what-is',
    moduleId: 'm1',
    title: 'What is an embedded system?',
    page: 1,
    summary: 'A computing system built into a larger device for one specific function.',
    blocks: [
      {
        type: 'definition',
        term: 'Embedded system',
        text: 'A computing system built into a larger device to perform one specific function.',
      },
      {
        type: 'p',
        text: 'Unlike a general-purpose computer, which can run many applications, an embedded system is designed to perform a dedicated task.',
      },
      {
        type: 'p',
        text: 'Examples listed in the reviewer:',
      },
      {
        type: 'list',
        items: [
          'Washing machine controller',
          'Microwave oven controller',
          'Automatic door',
          'Traffic light controller',
          'Temperature monitoring system',
          'Smart home devices',
        ],
      },
    ],
  },
  {
    id: 'm1-comparison',
    moduleId: 'm1',
    title: 'Embedded system vs. general-purpose computer',
    page: 1,
    summary: 'Five comparison points and the two examples used by the reviewer.',
    blocks: [
      {
        type: 'compare',
        leftTitle: 'General-Purpose Computer',
        rightTitle: 'Embedded System',
        rows: [
          {
            label: 'Applications',
            left: 'Runs many applications',
            right: 'Performs a dedicated function',
          },
          {
            label: 'Memory and storage',
            left: 'Usually has more memory and storage',
            right: 'Has limited memory and resources',
          },
          {
            label: 'Software',
            left: 'Software can be changed by users',
            right: 'Software is often fixed for the device',
          },
          {
            label: 'Timing',
            left: 'Timing is generally flexible',
            right: 'Timing can be critical',
          },
          {
            label: 'Example',
            left: 'Laptop',
            right: 'Washing machine controller',
          },
        ],
      },
    ],
  },
  {
    id: 'm1-characteristics',
    moduleId: 'm1',
    title: 'Core characteristics of embedded systems',
    page: 1,
    summary: 'Seven characteristics, their meanings, and the reviewer’s examples.',
    blocks: [
      {
        type: 'table',
        headers: ['Characteristic', 'Meaning', 'Example'],
        rows: [
          ['Dedicated / Specific Function', 'Designed to perform one particular task', 'Automatic door controller'],
          ['Real-Time Operation', 'Must respond within a required time limit', 'Airbag controller'],
          ['Deterministic Behavior', 'Produces predictable outputs under the same conditions', 'Traffic light sequence'],
          ['Resource Constraints', 'Has limited memory, processing power, and energy', 'Fitness band'],
          ['Hardware–Software Integration', 'Software works closely with specific hardware', 'Arduino-based controller'],
          ['Continuous Interaction', 'Constantly reads inputs and controls outputs', 'Thermostat'],
          ['Power and Size Considerations', 'Designed to be compact and energy-efficient', 'Pacemaker'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Important things to remember',
        items: [
          'Dedicated function = One specific job.',
          'Real-time = Responds within a required time.',
          'Deterministic = Predictable behavior.',
          'Resource constraints = Limited resources.',
          'Hardware–software integration = Software and hardware work together.',
        ],
      },
    ],
  },
  {
    id: 'm1-requirements',
    moduleId: 'm1',
    title: 'Functional requirements vs. quality attributes',
    page: 1,
    summary: 'Two different ideas, illustrated with the reviewer’s thermostat examples.',
    blocks: [
      {
        type: 'definition',
        term: 'Functional Requirement',
        text: 'Describes what the system should do.',
      },
      {
        type: 'p',
        text: 'Example: A thermostat turns ON the heater when the room temperature is below the set temperature.',
      },
      {
        type: 'definition',
        term: 'Quality Attribute',
        text: 'Describes how well the system performs its function.',
      },
      {
        type: 'p',
        text: 'Example: The thermostat must respond within two seconds and operate reliably for several years.',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'The distinction',
        text: 'A functional requirement is about what the system should do. A quality attribute is about how well it performs that function.',
      },
    ],
  },
  {
    id: 'm1-quality',
    moduleId: 'm1',
    title: 'Common quality attributes',
    page: 1,
    summary: 'Ten quality attributes and their meanings.',
    blocks: [
      {
        type: 'table',
        headers: ['Quality Attribute', 'Meaning'],
        rows: [
          ['Reliability', 'Continues working correctly without unexpected failures'],
          ['Maintainability', 'Can be repaired, diagnosed, or updated easily'],
          ['Performance', 'Meets required speed and processing needs'],
          ['Power Efficiency', 'Uses minimal energy'],
          ['Availability', 'Ready to operate when needed'],
          ['Cost', 'Stays within the required budget'],
          ['Safety', 'Does not cause harm, even when something goes wrong'],
          ['Size / Weight', 'Fits the physical requirements of the device'],
          ['Security', 'Protects against unauthorized access or attacks'],
          ['Scalability / Flexibility', 'Can be adapted or extended for different needs'],
        ],
      },
    ],
  },
  {
    id: 'm1-operational',
    moduleId: 'm1',
    title: 'Operational vs. non-operational attributes',
    page: [1, 2],
    summary: 'Operational attributes are observed while running; non-operational attributes span the system’s lifetime.',
    blocks: [
      {
        type: 'p',
        text: 'Operational attributes are observed while the system is running.',
      },
      {
        type: 'list',
        items: [
          'Response time',
          'Throughput',
          'Accuracy while operating',
          'Current consumption during operation',
        ],
      },
      {
        type: 'p',
        text: 'Non-operational attributes describe the system across its lifetime and use.',
      },
      {
        type: 'list',
        items: [
          'Maintainability',
          'Portability',
          'Scalability',
          'Cost',
          'Usability',
          'Long-term reliability',
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: [
          'Operational = While the system is running.',
          'Non-operational = Across the system’s lifetime.',
        ],
      },
    ],
  },

  // ── Module 2 ──────────────────────────────────────────────────────────────
  {
    id: 'm2-programming',
    moduleId: 'm2',
    title: 'Embedded programming and firmware',
    page: 2,
    summary: 'Software that controls dedicated hardware, and what firmware tells the microcontroller to do.',
    blocks: [
      {
        type: 'definition',
        term: 'Embedded programming',
        text: 'The development of software or firmware that controls and interacts with dedicated hardware.',
      },
      {
        type: 'p',
        text: 'The firmware tells the microcontroller what to do with the connected sensors, buttons, LEDs, motors, and other components.',
      },
    ],
  },
  {
    id: 'm2-structure',
    moduleId: 'm2',
    title: 'Basic structure of an Arduino program',
    page: 2,
    summary: 'setup() runs once; loop() repeats while the board is powered.',
    blocks: [
      {
        type: 'definition',
        term: 'setup()',
        text: 'Runs only once when the Arduino starts or resets. Used to configure pins and initialize communication.',
      },
      {
        type: 'definition',
        term: 'loop()',
        text: 'Runs repeatedly while the board is powered. Contains the main instructions of the program.',
      },
      {
        type: 'code',
        language: 'cpp',
        caption: 'LED blink example from the reviewer (pin 13)',
        code: `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);

    digitalWrite(13, LOW);
    delay(1000);
}`,
      },
      {
        type: 'p',
        text: 'This program makes the LED turn ON for one second and OFF for one second continuously.',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Program flow',
        items: ['setup() = Runs once.', 'loop() = Repeats continuously.'],
      },
    ],
  },
  {
    id: 'm2-functions',
    moduleId: 'm2',
    title: 'Important Arduino functions',
    page: 2,
    summary: 'Twelve functions and constants the reviewer lists for the examination.',
    blocks: [
      {
        type: 'table',
        headers: ['Function / Constant', 'Purpose'],
        rows: [
          ['pinMode()', 'Configures a pin as INPUT or OUTPUT'],
          ['digitalWrite()', 'Sets a digital output to HIGH or LOW'],
          ['digitalRead()', 'Reads the state of a digital input'],
          ['analogRead()', 'Reads an analog input value'],
          ['delay()', 'Pauses program execution for a specified time'],
          ['millis()', 'Returns elapsed milliseconds since the board started'],
          ['Serial.begin()', 'Starts serial communication'],
          ['Serial.print()', 'Prints information without automatically adding a new line'],
          ['Serial.println()', 'Prints information and adds a new line'],
          ['tone()', 'Generates a sound signal at a specified frequency'],
          ['noTone()', 'Stops the sound signal'],
          ['LED_BUILTIN', 'Identifies the built-in LED pin'],
        ],
      },
    ],
  },
  {
    id: 'm2-constants',
    moduleId: 'm2',
    title: 'Important constants',
    page: 3,
    summary: 'HIGH, LOW, INPUT, OUTPUT, and INPUT_PULLUP.',
    blocks: [
      {
        type: 'table',
        headers: ['Constant', 'Meaning'],
        rows: [
          ['HIGH', 'Logic level 1; usually turns an active-high LED ON'],
          ['LOW', 'Logic level 0; usually turns an active-high LED OFF'],
          ['INPUT', 'Configures a pin to receive input'],
          ['OUTPUT', 'Configures a pin to send output'],
          ['INPUT_PULLUP', 'Enables the internal pull-up resistor for an input'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember these',
        items: [
          'HIGH = ON (for the active-high LED circuits in our activities).',
          'LOW = OFF.',
          'INPUT = Receives information.',
          'OUTPUT = Sends signals.',
          'setup() = Runs once.',
          'loop() = Repeats continuously.',
        ],
      },
    ],
  },
  {
    id: 'm2-infinite',
    moduleId: 'm2',
    title: 'What is an infinite loop?',
    page: 3,
    summary: 'The program repeats its instructions while the microcontroller is running.',
    blocks: [
      {
        type: 'definition',
        term: 'Infinite loop',
        text: 'The program continuously repeats its instructions while the microcontroller is running.',
      },
      {
        type: 'p',
        text: 'In Arduino, the loop() function automatically repeats.',
      },
      {
        type: 'p',
        text: 'For example, an LED blinking program continuously performs these steps:',
      },
      {
        type: 'steps',
        items: [
          { title: 'Turn LED ON.' },
          { title: 'Wait one second.' },
          { title: 'Turn LED OFF.' },
          { title: 'Wait one second.' },
          { title: 'Repeat the process.' },
        ],
        ordered: true,
      },
    ],
  },
  {
    id: 'm2-build',
    moduleId: 'm2',
    title: 'Build and firmware development process',
    page: 3,
    summary: 'Six steps from source code to flash memory, plus four important terms.',
    blocks: [
      {
        type: 'p',
        text: 'Before an embedded program can run on a microcontroller, its source code must go through a build process.',
      },
      {
        type: 'table',
        headers: ['Process', 'Description'],
        rows: [
          ['Preprocessing', 'Expands directives such as #include and #define'],
          ['Compilation', 'Converts source code into lower-level instructions'],
          ['Assembly', 'Produces object files'],
          ['Linking', 'Combines object files and arranges code and data'],
          ['Firmware Generation', 'Produces the firmware image, such as .hex or .bin'],
          ['Downloading / Flashing', 'Writes firmware into the microcontroller’s flash memory'],
        ],
      },
      {
        type: 'definition',
        term: 'Firmware',
        text: 'Software stored in a device that controls its hardware.',
      },
      {
        type: 'definition',
        term: 'Bootloader',
        text: 'A small program already stored in the microcontroller that can receive and write new firmware.',
      },
      {
        type: 'definition',
        term: 'Flash Memory',
        text: 'Non-volatile memory used to store firmware. Its contents remain even when power is removed.',
      },
      {
        type: 'definition',
        term: 'Hardware Programmer / Probe',
        text: 'A device used to program a microcontroller and, in many setups, support debugging.',
      },
    ],
  },
  {
    id: 'm2-testing',
    moduleId: 'm2',
    title: 'Testing vs. debugging',
    page: 3,
    summary: 'Testing asks whether requirements are met; debugging asks why a failure happened.',
    blocks: [
      {
        type: 'definition',
        term: 'Testing answers the question',
        text: '“Does the system meet the requirements?”',
      },
      {
        type: 'definition',
        term: 'Debugging answers the question',
        text: '“Why did the system fail, and what is causing the problem?”',
      },
    ],
  },
  {
    id: 'm2-tools',
    moduleId: 'm2',
    title: 'Common development and debugging tools',
    page: 3,
    summary: 'Seven tools and their purposes.',
    blocks: [
      {
        type: 'table',
        headers: ['Tool', 'Purpose'],
        rows: [
          ['IDE', 'Used to write, build, upload, and debug code'],
          ['Compiler', 'Converts source code into instructions'],
          ['Serial Monitor', 'Displays program messages and sensor readings'],
          ['Oscilloscope', 'Displays electrical signals over time'],
          ['Logic Analyzer', 'Examines digital signals and communication'],
          ['Multimeter', 'Measures voltage, current, and resistance'],
          ['Programmer / Debug Probe', 'Uploads firmware and helps debug real hardware'],
        ],
      },
    ],
  },
  {
    id: 'm2-sim',
    moduleId: 'm2',
    title: 'Remote debugger, emulator, and simulator',
    page: [3, 4],
    summary: 'Real hardware vs. a reproduced platform vs. modeled behavior.',
    blocks: [
      {
        type: 'table',
        headers: ['Tool', 'Meaning', 'Example'],
        rows: [
          ['Remote Debugger', 'Connects to and controls a real microcontroller through a debug interface', 'ST-LINK'],
          ['Emulator', 'Reproduces another processor or board so the actual firmware binary can run virtually', 'QEMU'],
          ['Simulator', 'Models the behavior of a circuit, microcontroller, sensors, and actuators', 'Wokwi, Proteus'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: [
          'Remote debugger = Real hardware.',
          'Emulator = Runs the target firmware on a reproduced platform.',
          'Simulator = Models the system’s behavior.',
        ],
      },
    ],
  },
  {
    id: 'm2-power',
    moduleId: 'm2',
    title: 'Low-power operation',
    page: 4,
    summary: 'Four sleep modes, wake-up by interrupt, and the trade-off of deeper sleep.',
    blocks: [
      {
        type: 'p',
        text: 'Embedded systems often have limited power, especially when they operate using batteries. One way to reduce power consumption is through sleep modes.',
      },
      {
        type: 'table',
        headers: ['Mode', 'Description'],
        rows: [
          ['Active', 'CPU and peripherals are running'],
          ['Idle / Sleep', 'CPU is halted while clocks and peripherals may continue running'],
          ['Deep Sleep / Stop', 'Most clocks are turned OFF while selected wake-up sources remain available'],
          ['Standby', 'Almost everything is turned OFF; waking up may behave like a reset'],
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Wake-up',
        text: 'An interrupt can wake the microcontroller from a low-power state.',
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Important',
        text: 'Deeper sleep generally saves more power but may require more time to wake up.',
      },
    ],
  },

  // ── Module 3 ──────────────────────────────────────────────────────────────
  {
    id: 'm3-realtime',
    moduleId: 'm3',
    title: 'Hard real-time vs. soft real-time',
    page: 4,
    summary: 'The consequence of a missed deadline is the key distinction.',
    blocks: [
      {
        type: 'definition',
        term: 'Hard Real-Time System',
        text: 'Missing a deadline is considered a system failure, even if it happens only once.',
      },
      {
        type: 'p',
        text: 'Examples:',
      },
      {
        type: 'list',
        items: ['Airbag deployment controller', 'Industrial emergency shutdown controller'],
      },
      {
        type: 'definition',
        term: 'Soft Real-Time System',
        text: 'Missing a deadline reduces the quality of the output, but the system can continue operating.',
      },
      {
        type: 'p',
        text: 'Examples:',
      },
      {
        type: 'list',
        items: ['Video streaming', 'Media playback', 'Non-critical display updates'],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: ['Hard real-time = Deadline must be met.', 'Soft real-time = Late response affects quality.'],
      },
    ],
  },
  {
    id: 'm3-timing',
    moduleId: 'm3',
    title: 'Response time, deadline, and timing margin',
    page: 4,
    summary: 'Three definitions, the timing margin formula, and the reviewer’s 10 ms / 7 ms example.',
    blocks: [
      {
        type: 'definition',
        term: 'Response Time',
        text: 'The total time from detecting an event until the system completes its output response.',
      },
      {
        type: 'definition',
        term: 'Deadline',
        text: 'The latest acceptable time for completing an operation.',
      },
      {
        type: 'definition',
        term: 'Timing Margin',
        text: 'The remaining time before the deadline.',
      },
      {
        type: 'formula',
        expression: 'Timing Margin = Deadline − Response Time',
        caption: 'Formula from the reviewer.',
      },
      {
        type: 'steps',
        title: 'Worked example',
        items: [
          { title: 'Given', text: 'Deadline = 10 ms; Response Time = 7 ms.' },
          { title: 'Substitute', text: 'TM = 10 − 7' },
          { title: 'Result', text: 'TM = 3 ms' },
        ],
        ordered: false,
      },
      {
        type: 'p',
        text: 'The system meets the deadline because the timing margin is positive.',
      },
      {
        type: 'table',
        headers: ['Timing Margin', 'Meaning'],
        rows: [
          ['Positive', 'Deadline is met'],
          ['Zero', 'Response finishes exactly at the deadline'],
          ['Negative', 'Deadline is missed'],
        ],
      },
    ],
  },
  {
    id: 'm3-interrupts',
    moduleId: 'm3',
    title: 'Interrupts and timers',
    page: 4,
    summary: 'Interrupt, ISR, periodic interrupt, and why interrupts are useful.',
    blocks: [
      {
        type: 'definition',
        term: 'Interrupt',
        text: 'A signal that tells the processor to pause its current task and execute a special routine.',
      },
      {
        type: 'definition',
        term: 'Interrupt Service Routine (ISR)',
        text: 'The special routine executed when an interrupt occurs.',
      },
      {
        type: 'definition',
        term: 'Periodic Interrupt',
        text: 'An interrupt generated at fixed time intervals by a hardware timer.',
      },
      {
        type: 'p',
        text: 'Example: A temperature monitoring system can use a timer interrupt to check the temperature sensor every 100 milliseconds.',
      },
      {
        type: 'p',
        text: 'Why use interrupts? Instead of continuously checking the clock, the processor can perform other tasks and respond when the timer generates an interrupt.',
      },
    ],
  },
  {
    id: 'm3-pwm',
    moduleId: 'm3',
    title: 'PWM (Pulse Width Modulation)',
    page: 5,
    summary: 'Switching a digital output to control average power, with the terms and formulas.',
    blocks: [
      {
        type: 'definition',
        term: 'PWM',
        text: 'A technique that rapidly switches a digital output between HIGH and LOW to control the average power delivered to a device.',
      },
      {
        type: 'p',
        text: 'It is commonly used for:',
      },
      {
        type: 'list',
        items: ['LED brightness', 'Motor speed', 'Servo motor control', 'Fan speed'],
      },
      {
        type: 'table',
        headers: ['PWM Term', 'Meaning'],
        rows: [
          ['Period (T)', 'The total time needed to complete one cycle.'],
          ['Frequency (f)', 'The number of cycles per second.'],
          ['ON Time', 'The time the signal stays HIGH.'],
          ['OFF Time', 'The time the signal stays LOW.'],
          ['Duty Cycle', 'The percentage of time the signal stays HIGH during one complete cycle.'],
        ],
      },
      {
        type: 'formula',
        expression: 'Frequency = 1 / Period',
      },
      {
        type: 'formula',
        expression: 'Duty Cycle = (ON Time / Period) × 100',
      },
      {
        type: 'formula',
        expression: 'OFF Time = Period − ON Time',
      },
      {
        type: 'steps',
        title: 'Worked example',
        items: [
          { title: 'Given', text: 'ON time = 5 ms; total period = 10 ms.' },
          { title: 'Substitute', text: 'DC = (5 / 10) × 100' },
          { title: 'Result', text: 'DC = 50%' },
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        text: 'A higher duty cycle generally means more average power delivered to the load. For an LED, this means greater brightness.',
      },
    ],
  },
  {
    id: 'm3-data',
    moduleId: 'm3',
    title: 'Data acquisition',
    page: 5,
    summary: 'Six stages from physical phenomenon to data or decision, plus analog vs. digital signals.',
    blocks: [
      {
        type: 'definition',
        term: 'Data acquisition',
        text: 'The process of collecting information from the physical environment and converting it into digital values that the processor can understand.',
      },
      {
        type: 'p',
        text: 'Stages of data acquisition:',
      },
      {
        type: 'steps',
        items: [
          { title: 'Physical Phenomenon', text: 'The quantity being measured, such as temperature, light, or pressure.' },
          { title: 'Sensor', text: 'Converts the physical quantity into an electrical signal.' },
          { title: 'Signal Conditioning', text: 'Amplifies, filters, or scales the signal.' },
          { title: 'ADC', text: 'Converts the analog signal into a digital value.' },
          { title: 'Processor', text: 'Reads and processes the digital value.' },
          { title: 'Data / Decision', text: 'Produces a result or decides what action to take.' },
        ],
        ordered: true,
      },
      {
        type: 'table',
        headers: ['Analog Signal', 'Digital Signal'],
        rows: [
          ['Continuous signal', 'Discrete numeric values'],
          ['Changes smoothly over time', 'Represented by numbers'],
          ['Example: Sensor voltage', 'Example: ADC reading'],
        ],
      },
    ],
  },
  {
    id: 'm3-adc',
    moduleId: 'm3',
    title: 'ADC, codes, resolution, and quantization',
    page: 5,
    summary: 'The ideal N-bit ADC formulas, the 8/10/12-bit examples, LSB, and rounding error.',
    blocks: [
      {
        type: 'definition',
        term: 'ADC (Analog-to-Digital Converter)',
        text: 'Converts analog signals into digital values.',
      },
      {
        type: 'p',
        text: 'For an ideal N-bit ADC:',
      },
      {
        type: 'formula',
        expression: 'Number of Codes = 2^{N}',
      },
      {
        type: 'list',
        items: ['8-bit ADC = 256 codes', '10-bit ADC = 1,024 codes', '12-bit ADC = 4,096 codes'],
      },
      {
        type: 'formula',
        expression: 'LSB = V_{ref} / 2^{N}',
        caption: 'For an ideal ADC.',
      },
      {
        type: 'p',
        text: 'LSB means Least Significant Bit, or the voltage step represented by one ADC count.',
      },
      {
        type: 'p',
        text: 'A higher ADC resolution means more detailed digital measurements.',
      },
      {
        type: 'definition',
        term: 'Quantization',
        text: 'The process of mapping a continuous analog voltage to a discrete digital value.',
      },
      {
        type: 'p',
        text: 'The ideal rounding error is approximately ±½ LSB.',
      },
    ],
  },
  {
    id: 'm3-sensors',
    moduleId: 'm3',
    title: 'Sensors',
    page: [5, 6],
    summary: 'A sensor converts a physical quantity into an electrical signal.',
    blocks: [
      {
        type: 'definition',
        term: 'Sensor',
        text: 'Converts a physical quantity into an electrical signal that a processor can read.',
      },
      {
        type: 'table',
        headers: ['Sensor', 'Application'],
        rows: [
          ['Temperature Sensor', 'Thermostat'],
          ['Light Sensor', 'Automatic streetlight'],
          ['Pressure Sensor', 'Tire pressure monitoring'],
          ['Proximity Sensor', 'Automatic door'],
          ['Accelerometer', 'Fitness tracker'],
          ['Humidity Sensor', 'Greenhouse monitoring'],
        ],
      },
    ],
  },
  {
    id: 'm3-actuators',
    moduleId: 'm3',
    title: 'Actuators',
    page: 6,
    summary: 'An actuator converts an electrical control signal into a physical action.',
    blocks: [
      {
        type: 'definition',
        term: 'Actuator',
        text: 'Converts an electrical control signal into a physical action.',
      },
      {
        type: 'table',
        headers: ['Actuator', 'Application'],
        rows: [
          ['Motor', 'Fan or conveyor belt'],
          ['Relay', 'Switching electrical loads'],
          ['Solenoid', 'Door lock'],
          ['Servo Motor', 'Robotic arm'],
          ['Buzzer', 'Alarm'],
          ['LED', 'Visual indicator'],
        ],
      },
    ],
  },
  {
    id: 'm3-loop',
    moduleId: 'm3',
    title: 'The sensor–processor–actuator loop',
    page: 6,
    summary: 'Sense → Process → Decide → Act, illustrated by the automatic fan.',
    blocks: [
      {
        type: 'formula',
        expression: 'Sense → Process → Decide → Act',
        caption: 'The sequence to remember.',
      },
      {
        type: 'p',
        text: 'Example: Automatic Fan',
      },
      {
        type: 'steps',
        items: [
          { title: 'The temperature sensor detects room temperature.' },
          { title: 'The processor reads the temperature.' },
          { title: 'The program checks the temperature against a target.' },
          { title: 'The motor adjusts the fan speed.' },
        ],
        ordered: true,
      },
      {
        type: 'p',
        text: 'This process repeats continuously.',
      },
    ],
  },

  // ── Module 4A ─────────────────────────────────────────────────────────────
  {
    id: 'm4a-overview',
    moduleId: 'm4a',
    title: 'Smart LED Alert System overview',
    page: 6,
    summary: 'Wokwi · Arduino Uno. Three LEDs and two pushbuttons communicate operating conditions.',
    blocks: [
      {
        type: 'callout',
        tone: 'lab',
        title: 'High-priority laboratory topic',
        text: 'The reviewer states that the programming portion of the examination will be based on the two laboratory activities. Study the pins, states, button behavior, and timing concepts closely.',
      },
      {
        type: 'p',
        text: 'Platform: Wokwi · Board: Arduino Uno',
      },
      {
        type: 'definition',
        term: 'Smart LED Alert System',
        text: 'An embedded system that uses three LEDs and two pushbuttons to communicate different operating conditions. It was developed using the Wokwi online electronics simulator.',
      },
    ],
  },
  {
    id: 'm4a-components',
    moduleId: 'm4a',
    title: 'Components and pin assignments',
    page: 6,
    summary: 'Three LEDs, two buttons, and a 220 Ω resistor for each external LED.',
    blocks: [
      {
        type: 'table',
        headers: ['Component', 'Arduino Pin', 'Function'],
        rows: [
          ['Green LED', 'D8', 'NORMAL indicator'],
          ['Yellow LED', 'D9', 'CAUTION indicator'],
          ['Red LED', 'D10', 'WARNING indicator'],
          ['Mode Button', 'D2', 'Changes the operating state'],
          ['Acknowledge Button', 'D3', 'Acknowledges the warning'],
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Resistor',
        text: 'Each external LED uses a 220 Ω resistor to limit current.',
      },
    ],
  },
  {
    id: 'm4a-states',
    moduleId: 'm4a',
    title: 'Operating states',
    page: 6,
    summary: 'NORMAL, CAUTION, WARNING, and ACKNOWLEDGED, with the documented LED behavior.',
    blocks: [
      {
        type: 'table',
        headers: ['State', 'LED Behavior'],
        rows: [
          ['NORMAL', 'Green LED steadily ON'],
          ['CAUTION', 'Yellow LED blinks slowly'],
          ['WARNING', 'Red LED blinks in a distinctive pattern'],
          ['ACKNOWLEDGED', 'Red LED steadily ON'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Important',
        text: 'When the system is in ACKNOWLEDGED state, the warning condition is still active. The user has only acknowledged the warning; the actual problem has not necessarily been resolved.',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Not specified in the reviewer',
        text: 'The exact blink interval for CAUTION, the precise WARNING blink pattern, and the behavior of the other LEDs in each state are not specified in the reviewer.',
      },
    ],
  },
  {
    id: 'm4a-buttons',
    moduleId: 'm4a',
    title: 'Button behavior',
    page: 6,
    summary: 'The mode sequence and the four rules for the acknowledge button.',
    blocks: [
      {
        type: 'p',
        text: 'Mode Button (D2) — Changes the operating state in this sequence:',
      },
      {
        type: 'formula',
        expression: 'NORMAL → CAUTION → WARNING → NORMAL',
      },
      {
        type: 'p',
        text: 'Acknowledge Button (D3):',
      },
      {
        type: 'list',
        items: [
          'Works only when the system is in WARNING state.',
          'Changes the red LED from blinking to steadily ON.',
          'Does not clear the actual warning condition.',
          'Acknowledgement is cleared when the system leaves WARNING.',
        ],
      },
    ],
  },
  {
    id: 'm4a-pullup',
    moduleId: 'm4a',
    title: 'Understanding INPUT_PULLUP',
    page: 7,
    summary: 'Not pressed = HIGH; pressed = LOW. The buttons are active-LOW.',
    blocks: [
      {
        type: 'p',
        text: 'The pushbuttons use the Arduino INPUT_PULLUP configuration.',
      },
      {
        type: 'table',
        headers: ['Button Condition', 'Reading'],
        rows: [
          ['Not pressed', 'HIGH'],
          ['Pressed', 'LOW'],
        ],
      },
      {
        type: 'p',
        text: 'Why? Because the button is connected between the input pin and GND. The internal pull-up resistor keeps the input HIGH when the button is not pressed. This means the button is considered active-LOW.',
      },
    ],
  },
  {
    id: 'm4a-timing',
    moduleId: 'm4a',
    title: 'Blocking vs. non-blocking timing',
    page: 7,
    summary: 'delay() pauses the program; millis() measures elapsed time without blocking.',
    blocks: [
      {
        type: 'definition',
        term: 'Blocking Timing — delay()',
        text: 'The delay() function pauses the program for a specified time.',
      },
      {
        type: 'code',
        code: 'delay(1000);',
        caption: 'Pauses program execution for 1,000 milliseconds or one second.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Problem',
        text: 'While the program is waiting, it cannot continue checking the pushbuttons in the normal loop.',
      },
      {
        type: 'definition',
        term: 'Non-Blocking Timing — millis()',
        text: 'The millis() function returns the number of milliseconds since the Arduino started running. Instead of stopping the program, we check whether enough time has passed.',
      },
      {
        type: 'code',
        language: 'cpp',
        caption: 'millis() fragment from the reviewer',
        code: `unsigned long now = millis();

if (now - lastChange >= interval) {

    lastChange = now;

    // Update LED behavior

}`,
      },
      {
        type: 'list',
        items: [
          'millis() gets the current elapsed time.',
          'lastChange stores the previous time reference.',
          'interval stores the required time interval.',
          'now - lastChange calculates the elapsed time.',
          '>= checks whether the required interval has passed.',
        ],
      },
      {
        type: 'p',
        text: 'Why use millis()? Because the program can continue checking the buttons while the LEDs are blinking.',
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: [
          'delay() = Pauses the program.',
          'millis() = Measures elapsed time without blocking the program.',
        ],
      },
    ],
  },
  {
    id: 'm4a-wokwi',
    moduleId: 'm4a',
    title: 'Wokwi',
    page: 7,
    summary: 'An online electronics simulator, its workspace elements, and the limits of simulation.',
    blocks: [
      {
        type: 'definition',
        term: 'Wokwi',
        text: 'An online electronics simulator that allows users to create, run, and test electronic circuits and Arduino programs in a browser.',
      },
      {
        type: 'table',
        headers: ['Element', 'Purpose'],
        rows: [
          ['sketch.ino', 'Contains the Arduino source code'],
          ['diagram.json', 'Stores the circuit description'],
          ['Circuit Editor', 'Used to add and connect components'],
          ['Start / Stop', 'Runs or stops the simulation'],
          ['Serial Monitor', 'Displays text output from the program'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Remember',
        text: 'A simulation is not exactly the same as real hardware. Actual circuits may have wiring problems, electrical limitations, and timing differences.',
      },
    ],
  },

  // ── Module 4B ─────────────────────────────────────────────────────────────
  {
    id: 'm4b-overview',
    moduleId: 'm4b',
    title: 'Temperature Monitoring and Alert System overview',
    page: 7,
    summary: 'Tinkercad Circuits · Arduino Uno R3. A TMP36 reading controls an LED and buzzer at the warning threshold.',
    blocks: [
      {
        type: 'callout',
        tone: 'lab',
        title: 'High-priority laboratory topic',
        text: 'The reviewer states that the programming portion of the examination will be based on the two laboratory activities. This activity includes the TMP36 formula, Arduino ADC conversion, the if-else threshold, Serial Monitor output, and debugging.',
      },
      {
        type: 'p',
        text: 'Platform: Tinkercad Circuits · Board: Arduino Uno R3',
      },
      {
        type: 'p',
        text: 'This laboratory activity uses an Arduino Uno R3 and a TMP36 temperature sensor to monitor temperature. The system reads the sensor, converts the analog reading into a temperature value, and activates an LED and buzzer when the temperature reaches the warning threshold.',
      },
    ],
  },
  {
    id: 'm4b-behavior',
    moduleId: 'm4b',
    title: 'Expected system behavior',
    page: 8,
    summary: 'Below 30°C is normal; 30°C or higher activates the LED, buzzer, and warning message.',
    blocks: [
      {
        type: 'table',
        headers: ['Temperature', 'Red LED', 'Buzzer', 'Serial Monitor'],
        rows: [
          ['Below 30°C', 'OFF', 'Silent', 'Status: Normal'],
          ['30°C or higher', 'ON', '1000 Hz', 'WARNING: High Temperature!'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: ['Below 30°C = Normal.', '30°C and above = Warning.'],
      },
    ],
  },
  {
    id: 'm4b-components',
    moduleId: 'm4b',
    title: 'Components and their functions',
    page: 8,
    summary: 'Seven components used in the Tinkercad activity.',
    blocks: [
      {
        type: 'table',
        headers: ['Component', 'Function'],
        rows: [
          ['Arduino Uno R3', 'Processes sensor readings and controls outputs'],
          ['TMP36', 'Measures temperature'],
          ['Red LED', 'Provides a visual warning'],
          ['220 Ω Resistor', 'Limits LED current'],
          ['Piezo Buzzer', 'Provides an audible warning'],
          ['Breadboard', 'Helps organize circuit connections'],
          ['Connecting Wires', 'Connect the components'],
        ],
      },
    ],
  },
  {
    id: 'm4b-circuit',
    moduleId: 'm4b',
    title: 'Circuit connections',
    page: 8,
    summary: 'Every TMP36, LED, and buzzer connection, plus the TMP36 orientation.',
    blocks: [
      {
        type: 'p',
        text: 'Memorize these pin assignments.',
      },
      {
        type: 'table',
        headers: ['Component', 'Arduino Connection'],
        rows: [
          ['TMP36 Left Pin (+Vs)', '5V'],
          ['TMP36 Middle Pin (Vout)', 'A0'],
          ['TMP36 Right Pin (GND)', 'GND'],
          ['Red LED Anode (+)', 'D9 through 220 Ω resistor'],
          ['Red LED Cathode (−)', 'GND'],
          ['Piezo Buzzer Positive (+)', 'D8'],
          ['Piezo Buzzer Negative (−)', 'GND'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'TMP36 orientation',
        text: 'When the flat side of the TMP36 faces you and the pins point downward:',
        items: ['Left = +Vs', 'Middle = Vout', 'Right = GND'],
      },
    ],
  },
  {
    id: 'm4b-tmp36',
    moduleId: 'm4b',
    title: 'Understanding the TMP36 temperature sensor',
    page: 8,
    summary: 'Vout = 0.5 + 0.01T, the four tabulated examples, and the temperature conversion formula.',
    blocks: [
      {
        type: 'p',
        text: 'The TMP36 produces an analog voltage based on the measured temperature. Its output voltage follows this relationship:',
      },
      {
        type: 'formula',
        expression: 'V_{out} = 0.5 + 0.01T',
      },
      {
        type: 'p',
        text: 'Where:',
      },
      {
        type: 'list',
        items: [
          'Vout = Output voltage in volts',
          '0.5 = Sensor voltage offset',
          '0.01 = Voltage change per degree Celsius',
          'T = Temperature in °C',
        ],
      },
      {
        type: 'table',
        headers: ['Temperature', 'TMP36 Output Voltage'],
        rows: [
          ['0°C', '0.50 V'],
          ['25°C', '0.75 V'],
          ['30°C', '0.80 V'],
          ['35°C', '0.85 V'],
        ],
      },
      {
        type: 'formula',
        expression: 'Temperature = (Voltage − 0.5) × 100',
        caption: 'Temperature conversion formula.',
      },
      {
        type: 'steps',
        title: 'Worked example',
        items: [
          { title: 'Given', text: '0.80 V' },
          { title: 'Substitute', text: 'T = (0.80 − 0.5) × 100' },
          { title: 'Result', text: 'T = 30°C' },
        ],
      },
      {
        type: 'p',
        text: 'Why subtract 0.5? Because it removes the TMP36’s voltage offset.',
      },
      {
        type: 'p',
        text: 'Why multiply by 100? Because the TMP36 changes its output by 0.01 V for every 1°C.',
      },
    ],
  },
  {
    id: 'm4b-adc',
    moduleId: 'm4b',
    title: 'Understanding the Arduino ADC',
    page: 9,
    summary: '10-bit, 1,024 codes, 0–1023, the 5.0 / 1023.0 conversion, and the integer-division warning.',
    blocks: [
      {
        type: 'p',
        text: 'The Arduino Uno uses a 10-bit ADC. This means:',
      },
      {
        type: 'list',
        items: [
          'Number of bits = 10',
          'Number of available codes = 1,024',
          'ADC values range from 0 to 1023.',
          '0 V corresponds to approximately 0.',
          '2.5 V corresponds to approximately 512.',
          '5 V corresponds to approximately 1023.',
        ],
      },
      {
        type: 'p',
        text: 'The ADC converts the analog voltage from the TMP36 into a digital number.',
      },
      {
        type: 'formula',
        expression: 'Voltage = ADC Reading × (5.0 / 1023.0)',
        caption: 'Arduino Uno voltage conversion formula.',
      },
      {
        type: 'steps',
        title: 'Worked example',
        items: [
          { title: 'Given', text: 'ADC Reading = 153' },
          { title: 'Substitute', text: 'V = 153 × (5.0 / 1023.0)' },
          { title: 'Result', text: 'V ≈ 0.748 V' },
        ],
      },
      {
        type: 'p',
        text: 'The resulting voltage can then be converted into temperature.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Important programming reminder',
        text: 'Use 5.0 / 1023.0 instead of 5 / 1023. The second expression uses integer division, which produces zero. Using decimal values allows the calculation to retain its fractional result.',
      },
    ],
  },
  {
    id: 'm4b-variables',
    moduleId: 'm4b',
    title: 'Important variables in the program',
    page: 9,
    summary: 'Six variables, their purposes, and their data types.',
    blocks: [
      {
        type: 'table',
        headers: ['Variable', 'Purpose', 'Data Type'],
        rows: [
          ['tempPin', 'Stores the TMP36 analog pin', 'int'],
          ['ledPin', 'Stores the LED pin', 'int'],
          ['buzzerPin', 'Stores the buzzer pin', 'int'],
          ['sensorValue', 'Stores the raw ADC reading', 'int'],
          ['voltage', 'Stores the converted voltage', 'float'],
          ['temperature', 'Stores the computed temperature', 'float'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember',
        items: [
          'int = Stores whole numbers.',
          'float = Stores decimal values.',
          'For example, 153 can be stored as an int, while 0.748 and 24.78 should be stored as float.',
        ],
      },
    ],
  },
  {
    id: 'm4b-ifelse',
    moduleId: 'm4b',
    title: 'Understanding the if-else condition',
    page: [9, 10],
    summary: 'The exact threshold fragment, what each branch does, and the comparison operators.',
    blocks: [
      {
        type: 'p',
        text: 'The program uses an if-else statement to determine whether the temperature is normal or too high.',
      },
      {
        type: 'code',
        language: 'cpp',
        caption: 'If-else fragment from the reviewer',
        code: `if (temperature >= 30.0) {

    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 1000);

}
else {

    digitalWrite(ledPin, LOW);
    noTone(buzzerPin);

}`,
      },
      {
        type: 'p',
        text: 'The IF condition temperature >= 30.0 checks whether the temperature is greater than or equal to 30°C.',
      },
      {
        type: 'list',
        items: [
          'If TRUE: Red LED turns ON. Buzzer produces a 1000 Hz sound.',
          'ELSE condition runs when the temperature is below 30°C.',
          'If FALSE: Red LED turns OFF. Buzzer stops producing sound.',
        ],
      },
      {
        type: 'table',
        headers: ['Operator', 'Meaning'],
        rows: [
          ['>', 'Greater than'],
          ['<', 'Less than'],
          ['>=', 'Greater than or equal to'],
          ['<=', 'Less than or equal to'],
          ['==', 'Equal to'],
        ],
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Remember the difference',
        items: [
          'temperature >= 30.0 includes exactly 30°C.',
          'temperature > 30.0 does not include exactly 30°C.',
        ],
      },
    ],
  },
  {
    id: 'm4b-functions',
    moduleId: 'm4b',
    title: 'Important Arduino functions used in this activity',
    page: 10,
    summary: 'Nine functions and what each one does in the temperature activity.',
    blocks: [
      {
        type: 'table',
        headers: ['Function', 'Purpose'],
        rows: [
          ['analogRead(tempPin)', 'Reads the TMP36 analog value'],
          ['digitalWrite(ledPin, HIGH)', 'Turns the red LED ON'],
          ['digitalWrite(ledPin, LOW)', 'Turns the red LED OFF'],
          ['tone(buzzerPin, 1000)', 'Produces a 1000 Hz buzzer sound'],
          ['noTone(buzzerPin)', 'Stops the buzzer'],
          ['Serial.begin(9600)', 'Starts serial communication'],
          ['Serial.print()', 'Prints without automatically adding a new line'],
          ['Serial.println()', 'Prints and adds a new line'],
          ['delay(1000)', 'Waits for one second'],
        ],
      },
    ],
  },
  {
    id: 'm4b-serial',
    moduleId: 'm4b',
    title: 'Serial Monitor',
    page: 10,
    summary: 'The reviewer’s two output examples and the four ways the Serial Monitor is useful.',
    blocks: [
      {
        type: 'p',
        text: 'The Serial Monitor displays the temperature readings and the system status.',
      },
      {
        type: 'code',
        caption: 'Example output from the reviewer',
        code: `Temperature: 24.78 C
Status: Normal

Temperature: 35.04 C
WARNING: High Temperature!`,
      },
      {
        type: 'p',
        text: 'It is useful for:',
      },
      {
        type: 'list',
        items: [
          'Checking the converted temperature.',
          'Observing whether the system is in NORMAL or WARNING status.',
          'Debugging incorrect sensor readings.',
          'Checking whether the if-else condition works correctly.',
        ],
      },
    ],
  },
  {
    id: 'm4b-debug',
    moduleId: 'm4b',
    title: 'Basic debugging',
    page: 10,
    summary: 'Six common problems and their possible causes.',
    blocks: [
      {
        type: 'definition',
        term: 'Debugging',
        text: 'Finding and correcting errors in a program.',
      },
      {
        type: 'table',
        headers: ['Problem', 'Possible Cause'],
        rows: [
          ['Incorrect temperature reading', 'Incorrect TMP36 wiring or orientation'],
          ['LED does not turn ON', 'Wrong pin, reversed LED, or missing connection'],
          ['Buzzer produces no sound', 'Incorrect buzzer wiring'],
          ['Serial Monitor is empty', 'Missing Serial.begin() or simulation not running'],
          ['Warning does not activate', 'Incorrect temperature threshold'],
          ['Alarm does not turn OFF', 'Incorrect or missing else condition'],
        ],
      },
    ],
  },
  {
    id: 'm4b-optimization',
    moduleId: 'm4b',
    title: 'Optimization challenge',
    page: [10, 11],
    summary: 'How delay length changes sampling frequency and worst-case detection delay — and why longer delay is not automatically low power.',
    blocks: [
      {
        type: 'p',
        text: 'The original program uses:',
      },
      {
        type: 'code',
        code: 'delay(1000);',
      },
      {
        type: 'p',
        text: 'This means the system checks the temperature approximately once every second. When changed to delay(3000); the system checks the temperature approximately once every three seconds.',
      },
      {
        type: 'table',
        headers: ['Delay', 'Sampling Frequency', 'Approximate Worst-Case Detection Delay'],
        rows: [
          ['1000 ms', '1 sample per second', '1 second'],
          ['3000 ms', '0.33 sample per second', '3 seconds'],
        ],
      },
      {
        type: 'p',
        text: 'A longer delay means the system checks less frequently, making it more likely to miss short temperature changes.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Important',
        text: 'A longer delay() does not automatically mean the system is using less power. Actual low-power operation requires techniques such as sleep modes and appropriate power measurements.',
      },
    ],
  },

  // ── Module 5 ──────────────────────────────────────────────────────────────
  {
    id: 'm5-formulas',
    moduleId: 'm5',
    title: 'Important formulas to memorize',
    page: 11,
    summary: 'The ten formulas the reviewer identifies for the computation portion.',
    blocks: [
      {
        type: 'p',
        text: 'These are the formulas to focus on for the Computation portion.',
      },
      {
        type: 'table',
        headers: ['Topic', 'Formula'],
        rows: [
          ['Response Time', 'Detection + Processing + Output'],
          ['Timing Margin', 'Deadline − Response Time'],
          ['Number of ADC Codes', '2^N'],
          ['ADC Resolution (LSB)', 'Vref / 2^N'],
          ['PWM Duty Cycle', '(ON Time / Period) × 100'],
          ['PWM Frequency', '1 / Period'],
          ['PWM Period', '1 / Frequency'],
          ['PWM OFF Time', 'Period − ON Time'],
          ['TMP36 Temperature', '(Voltage − 0.5) × 100'],
          ['ADC Voltage Conversion', 'ADC Reading × (5.0 / 1023.0)'],
        ],
      },
    ],
  },
  {
    id: 'm5-units',
    moduleId: 'm5',
    title: 'Units to remember',
    page: 11,
    summary: 'The unit attached to each formula quantity.',
    blocks: [
      {
        type: 'list',
        items: [
          'Response Time = milliseconds (ms)',
          'Timing Margin = milliseconds (ms)',
          'Frequency = Hertz (Hz)',
          'Period = seconds (s) or milliseconds (ms)',
          'Duty Cycle = percentage (%)',
          'Voltage = Volts (V)',
          'Temperature = degrees Celsius (°C)',
        ],
      },
    ],
  },
];

export const NOTE_SECTION_MAP = Object.fromEntries(
  NOTE_SECTIONS.map((section) => [section.id, section]),
) as Record<string, NoteSection>;

export function sectionsByModule(moduleId: ModuleId): NoteSection[] {
  return NOTE_SECTIONS.filter((section) => section.moduleId === moduleId);
}

export function noteSearchText(section: NoteSection): string {
  const parts: string[] = [section.title, section.summary ?? ''];
  for (const block of section.blocks) {
    switch (block.type) {
      case 'p':
        parts.push(block.text);
        break;
      case 'list':
        parts.push(...block.items);
        break;
      case 'table':
        parts.push(...block.headers, ...block.rows.flat());
        break;
      case 'code':
        parts.push(block.code, block.caption ?? '');
        break;
      case 'callout':
        parts.push(block.title ?? '', block.text ?? '', ...(block.items ?? []));
        break;
      case 'definition':
        parts.push(block.term, block.text);
        break;
      case 'steps':
        parts.push(block.title ?? '', ...block.items.flatMap((item) => [item.title, item.text ?? '']));
        break;
      case 'compare':
        parts.push(block.leftTitle, block.rightTitle, ...block.rows.flatMap((r) => [r.label, r.left, r.right]));
        break;
      case 'formula':
        parts.push(block.expression, block.caption ?? '');
        break;
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}
