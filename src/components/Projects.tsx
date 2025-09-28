import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star,
  ExternalLink, 
  Github, 
  ChevronRight,
  Cpu, 
  Shield, 
  Wifi, 
  Gauge, 
  Bot,
  Wrench,
  X,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import projectTelemetry from '@/assets/project-telemetry.jpg';
import projectSecurity from '@/assets/project-security.jpg';
import projectRobot from '@/assets/project-robot.jpg';
import projectPitStop from '@/assets/project-pitstop.jpg';
import projectWireless from '@/assets/project-wireless.jpg';
import projectFirewall from '@/assets/project-firewall.jpg';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  image: string;
  github?: string;
  demo?: string;
  featured: boolean;
  timeline: string;
  team: string;
  impact: string[];
  gallery: string[];
  startDate?: string; // ISO date, used for sorting (newest first)
  endDate?: string;   // ISO date, used for sorting (newest first)
}

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState(6);

  const publicBase = (import.meta.env.BASE_URL || '/');

  const getTitleBases = (title: string, explicitPath?: string) => {
    const candidates: string[] = [];
    if (explicitPath && explicitPath.trim().length > 0) {
      candidates.push((explicitPath || '').replace(/\.(jpg|jpeg|png|webp)$/i, ''));
    }
    const original = title;
    const noParens = title.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
    const noPunct = noParens.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
    const space = `${publicBase}pictures/${original}`;
    const spaceNoParens = `${publicBase}pictures/${noParens}`;
    const spaceNoPunct = `${publicBase}pictures/${noPunct}`;
    const hyphen = `${publicBase}pictures/${noPunct.replace(/\s+/g, '-')}`;
    const underscore = `${publicBase}pictures/${noPunct.replace(/\s+/g, '_')}`;
    [space, spaceNoParens, spaceNoPunct, hyphen, underscore].forEach((b) => {
      if (!candidates.includes(b)) candidates.push(b);
    });
    return candidates;
  };

  const categories = [
    { id: 'all', label: 'All Projects', icon: <Cpu className="h-4 w-4" /> },
    { id: 'featured', label: 'Featured', icon: <Star className="h-4 w-4" /> },
    { id: 'embedded', label: 'Embedded Systems', icon: <Cpu className="h-4 w-4" /> },
    { id: 'iot', label: 'IoT', icon: <Wifi className="h-4 w-4" /> },
    { id: 'security', label: 'Cybersecurity', icon: <Shield className="h-4 w-4" /> },
    { id: 'robotics', label: 'Robotics', icon: <Bot className="h-4 w-4" /> },
    { id: 'robotics-sim', label: 'Robotics & Simulation', icon: <Bot className="h-4 w-4" /> },
    { id: 'autonomy', label: 'Autonomous Robotics & AI', icon: <Bot className="h-4 w-4" /> },
    { id: 'dsp', label: 'Digital Signal Processing', icon: <Cpu className="h-4 w-4" /> },
    { id: 'analog', label: 'Analog Electronics', icon: <Cpu className="h-4 w-4" /> },
    { id: 'ml', label: 'Machine Learning', icon: <Cpu className="h-4 w-4" /> },
    { id: 'neteng', label: 'Networking Engineering', icon: <Shield className="h-4 w-4" /> },
    { id: 'tools', label: 'Tools & Utilities', icon: <Wrench className="h-4 w-4" /> }
  ];

  const projects: Project[] = [
    {
      id: 'dobot-arm-sorting-2025',
      title: 'Intelligent Robotic Arm Sorting System',
      description:
        'Dobot robotic arm sorting with computer vision and OCR; real-time classification by text and color.',
      longDescription:
        'This project involved the development of an intelligent control system for a Dobot Magician robotic arm. The core of the system is a computer vision pipeline that enables the robot to perceive and understand its environment. By integrating Optical Character Recognition (OCR) and color detection, the system can identify specific objects on a conveyor belt, classify them based on predefined rules (e.g., text "DXB" and color "Blue"), and perform sorting actions.\n\nTo ensure fluid, real-time operation, the vision processing and robotic control logic were separated using multithreading, allowing the system to analyze the camera feed without pausing robot movements. An infrared sensor serves as a trigger, initiating the sorting sequence only when an object is present.\n\nKey Features & Technical Details:\n• Real-time Vision Processing: Utilized OpenCV to capture and process a live camera feed on a separate thread for responsiveness\n• Advanced Text Recognition (OCR): Implemented PaddleOCR to accurately detect printed text for classification\n• HSV-Based Color Detection: Robust color detection using HSV ranges for Red, Blue, Yellow under varying lighting\n• Precise Robotic Arm Control: Dobot Magician EDU SDK for PTP moves, suction control, and conveyor speed management\n• Sensor-Driven Automation: Infrared (IR) sensor triggers sorting when an object is detected\n\nProject Impact & Objective:\n• Built a fully functional, real-time sorting system\n• Integrated arm, camera, sensor, and conveyor successfully\n• Achieved high classification accuracy via OCR + color analysis\n• Resolved real-time constraints using multithreading',
      category: 'robotics',
      tags: ['Python', 'OpenCV', 'Computer Vision', 'Robotics', 'OCR', 'Multithreading', 'Hardware Integration'],
      image: `${publicBase}pictures/Intelligent Robotic Arm Sorting System.jpg`,
      featured: false,
      timeline: '1 month',
      team: '3 people',
      impact: [
        'Fully functional, real-time sorting system',
        'Integrated robot, camera, sensor, conveyor',
        'High OCR and color-based classification accuracy',
        'Multithreaded architecture for responsiveness'
      ],
      gallery: [],
      startDate: '2025-02-01',
      endDate: '2025-03-31'
    },
    {
      id: 'maqueen-autonomous-2025',
      title: 'Autonomous Robot Navigation System',
      description:
        'FSM-driven autonomous navigation for a Maqueen robot with obstacle avoidance, dead-end escape, and line-based stopping.',
      longDescription:
        'This project is an autonomous navigation system engineered for the Maqueen robot platform. The core of the system is a Finite State Machine (FSM) that governs the robot\'s logic and behavior, ensuring predictable and structured responses to environmental stimuli.\n\nBy integrating an ultrasonic sensor for obstacle detection and line-tracking sensors for boundary conditions, the robot can navigate a space on its own. It is programmed to identify and maneuver around objects, intelligently handle complex scenarios like dead ends, and come to a complete stop upon reaching a designated line, demonstrating a robust foundation for autonomous mobility.\n\nKey Features & Technical Details:\n• Finite State Machine (FSM) Control: Deterministic states (FORWARD, OBSTACLE_DETECTED, DEAD_END, STOP) with clear sensor-driven transitions\n• Intelligent Obstacle Avoidance: Ultrasonic distance checks trigger avoidance; algorithm selects left/right path before turning\n• Dead-End Handling Strategy: If both sides are blocked, executes reverse + turn-around + randomized turn to escape\n• Sensor-Driven Stopping Mechanism: Line-tracking sensors transition to STOP when a boundary line is detected for precise halting\n\nProject Impact & Objective:\n• Developed a fully autonomous, deterministic navigation algorithm\n• Implemented a multi-state FSM for complex decisions\n• Robust dead-end recovery prevents stalls\n• Effective integration of ultrasonic and line-tracking sensors',
      category: 'robotics',
      tags: ['Robotics', 'JavaScript', 'Algorithms', 'FSM', 'Sensor Integration', 'Hardware Integration'],
      image: `${publicBase}pictures/Autonomous Robot Navigation System.jpg`,
      featured: false,
      timeline: '1 month',
      team: '3 people',
      impact: [
        'Autonomous, deterministic navigation',
        'Multi-state FSM for complex decisions',
        'Dead-end recovery strategy',
        'Integrated ultrasonic and line sensors'
      ],
      gallery: [],
      startDate: '2025-02-01',
      endDate: '2025-03-31'
    },
    {
      id: 'audio-denoise-2024',
      title: 'Smart Audio Denoising & Speech Restoration',
      description:
        'Multi-stage MATLAB pipeline to remove ringtone, fire alarm, and AC noise, restoring clear speech.',
      longDescription:
        'This project focused on the practical application of digital signal processing for speech restoration. The challenge was a single audio file contaminated with three distinct and overlapping noise sources: an iPhone ringtone, a high-frequency fire alarm, and low-frequency AC fan noise. The goal was to recover the clean, intelligible speech.\n\nUsing MATLAB, a systematic, multi-step approach was designed. Each noise source was identified via time-domain and spectrogram analysis, then targeted with tailored techniques.\n\nKey Features & Technical Details:\n• Noise Cancellation via Signal Inversion: Phase-inverted the known ringtone and mixed it into the affected segment to cancel it\n• Frequency-Domain Filtering for Tonal Noise: Designed precise bandstop filters to remove AC hum (≈1-400 Hz) and fire alarm tones (≈1.5 kHz and ≈3.4 kHz)\n• Comparative Analysis & Visualization: Built a MATLAB dashboard with waveforms and spectrograms before/after for clear proof of improvement\n\nProject Impact & Objective:\n• Restored intelligible speech from an otherwise unusable recording\n• Demonstrated proficiency in selecting the right approach (inversion vs. filtering)\n• Mastered spectrogram-driven diagnosis and MATLAB Signal Processing Toolbox workflows',
      category: 'dsp',
      tags: ['MATLAB', 'Signal Processing', 'Audio Processing', 'Digital Filtering', 'Noise Reduction', 'Data Visualization'],
      image: `${publicBase}pictures/Smart Audio Denoising & Speech Restoration.jpg`,
      featured: false,
      timeline: '2 weeks',
      team: '2 members',
      impact: [
        'Recovered clear speech from corrupted audio',
        'Applied multiple noise reduction strategies',
        'Spectrogram-driven diagnosis and verification',
        'Hands-on MATLAB Signal Processing experience'
      ],
      gallery: [],
      startDate: '2024-11-01',
      endDate: '2024-11-14'
    },
    {
      id: 'smart-agri-iot-2025',
      title: 'Smart Agricultural Monitoring System',
      description:
        'End-to-end IoT solution for real-time soil, light, and climate monitoring with cloud dashboard and email alerts.',
      longDescription:
        'This project addresses modern agriculture challenges with a data-driven remote monitoring solution. An Arduino Uno R4 WiFi aggregates sensor data (soil moisture, ambient light, temperature, humidity) and streams it to ThingSpeak for live visualization, while also logging locally.\n\nA MATLAB script periodically analyzes daily logs to detect anomalies and dispatch email alerts.\n\nKey Features & Technical Details:\n• Centralized IoT Hub: Arduino Uno R4 WiFi (C++) polls DHT11, LDR, and soil moisture sensors at intervals\n• Cloud Integration & Dashboard: Wireless telemetry to ThingSpeak enables remote, real-time graphs and gauges\n• Automated Anomaly Alerts: MATLAB parses daily CSV logs; threshold breaches trigger email notifications with context\n• Robust Data Logging: Dual logging to cloud and local CSV for redundancy and historical analysis\n\nProject Impact & Objective:\n• Built a complete IoT monitoring pipeline from sensor to cloud alerting\n• Integrated embedded hardware with a public cloud platform\n• Proactive farm management via automated anomaly detection\n• Designed and implemented the physical circuit and PCB layout',
      category: 'iot',
      tags: ['IoT', 'Arduino', 'MATLAB', 'C++', 'Sensor Integration', 'Cloud Integration', 'Data Visualization'],
      image: `${publicBase}pictures/Smart Agricultural Monitoring System.jpg`,
      featured: true,
      timeline: '1 month',
      team: '2 people',
      impact: [
        'Complete IoT solution with alerting',
        'Cloud dashboard on ThingSpeak',
        'Automated anomaly detection in MATLAB',
        'Custom circuit and PCB layout'
      ],
      gallery: [],
      startDate: '2025-01-01',
      endDate: '2025-01-31'
    },
    {
      id: 'traffic-signs-2024',
      title: 'Traffic Sign Recognition System',
      description:
        'MATLAB app combining edge detection and BoF/SVM to classify traffic signs with 94% validation accuracy.',
      longDescription:
        'This project presents a complete traffic sign recognition system built within MATLAB, targeting an efficient ADAS component. Images are preprocessed using Sobel edge detection to emphasize sign shapes.\n\nA Bag of Features (BoF) representation is then learned and fed into a multi-class SVM (fitcecoc) for classification, achieving 94% validation accuracy on GTSRB. A custom GUI wraps the workflow for dataset loading, training/validation, random testing, and external image upload.\n\nKey Features & Technical Details:\n• Machine Learning Pipeline: BoF feature extraction + multi-class SVM (fitcecoc) trained on GTSRB; 94% validation accuracy\n• Edge Detection Preprocessing: Sobel gradient magnitude used to highlight boundaries and symbols before BoF\n• Interactive MATLAB GUI: Dataset loading/preview, one-click training/validation, random test evaluation, and external image upload\n\nProject Impact & Objective:\n• Demonstrates a resource-efficient alternative to deep learning\n• Fully functional GUI-based tool for end-to-end experimentation and testing',
      category: 'dsp',
      tags: ['MATLAB', 'Machine Learning', 'Computer Vision', 'Image Processing', 'GUI Development', 'SVM'],
      image: `${publicBase}pictures/Traffic Sign Recognition System.jpg`,
      featured: false,
      timeline: '2 weeks',
      team: '2 people',
      impact: [
        '94% validation accuracy on GTSRB',
        'Classical CV + ML pipeline (BoF/SVM)',
        'End-to-end GUI workflow'
      ],
      gallery: [],
      startDate: '2024-09-01',
      endDate: '2024-09-14'
    },
    {
      id: 'parallel-image-equalization-2025',
      title: 'Parallel Image Processing Performance Analysis',
      description:
        'Java histogram equalization benchmark comparing single-threaded vs. multiple parallel designs for speedup.',
      longDescription:
        'This project explores parallel computing to accelerate image processing, focusing on histogram equalization to enhance image contrast. A correct single-threaded baseline was implemented first, then multiple multithreaded designs were developed and rigorously benchmarked to evaluate performance on multi-core processors.\n\nKey Features & Technical Details:\n• Single-Threaded Baseline: Standard pixel-wise histogram equalization used as a reference for speedup calculation\n• Parallel Design A (Shared State): Threads process different image parts while updating a shared histogram via AtomicIntegerArray; tested row-wise and interleaved-row work splitting\n• Parallel Design B (Private State & Merge): Each thread builds a private histogram; partial results are merged (map-reduce style) to minimize contention\n• Systematic Benchmarking: Runs repeated across thread counts (1, 2, 4, 6, 8, 10) recording average time and computing speedup (single-thread time / multi-thread time)\n\nProject Impact & Objective:\n• Implemented a classic image enhancement algorithm and multiple parallel patterns\n• Quantified speedup to provide data-driven insights into trade-offs of shared vs. private state designs\n• Gained practical experience with Java concurrency, atomic operations, and measurement',
      category: 'embedded',
      tags: ['Java', 'Multithreading', 'Concurrency', 'Performance Analysis', 'Image Processing', 'Algorithms'],
      image: `${publicBase}pictures/Parallel Image Processing Performance Analysis.jpg`,
      featured: false,
      timeline: '3 weeks',
      team: '1 person',
      impact: [
        'Implemented multiple parallelization strategies',
        'Measured and reported concrete speedups',
        'Hands-on experience with Java concurrency primitives'
      ],
      gallery: [],
      startDate: '2025-05-01',
      endDate: '2025-05-21'
    },
    {
      id: 'fault-tolerant-logger-2025',
      title: 'Fault-Tolerant Data Processing & Resilient Logging System',
      description:
        'Java simulation of majority voting for sensor validation and a cascading fallback logger to ensure data integrity.',
      longDescription:
        'This project simulates a safety-critical data processing environment in Java, emphasizing resilience to hardware and software failures. Two core principles underpin the design: accurate data via redundancy, and guaranteed capture via robust logging.\n\nA triple-redundancy, majority voting scheme validates a critical sensor reading. Complementing this, a custom FileLogger implements a cascading fallback strategy to ensure events are recorded even under simulated I/O failures. A built-in test harness validates the voting logic and logger behavior across predefined cases and randomized simulation.\n\nKey Features & Technical Details:\n• Redundancy & Majority Voting: Three replicas of a critical sensor feed performMajorityVote: if two agree, accept value and log the outlier; if all differ, flag a major discrepancy and fall back to last known-good value\n• Resilient Cascading Logger: Primary write to log.txt; on failure (simulated 40% chance) sequentially attempts backup files (log1.txt, log2.txt, ...); on total failure, writes a critical notice to principal_log.txt\n• Systematic Testing & Simulation: Test harness covers agreement, one-outlier, all-different cases, then runs randomized loops to demonstrate behavior under uncertainty\n\nProject Impact & Objective:\n• Demonstrates practical fault tolerance in software systems\n• Shows majority voting as a validation mechanism in redundant sensing\n• Prevents silent data loss via multi-tier logging with clear escalation paths\n• Validated through combined deterministic tests and randomized simulations',
      category: 'embedded',
      tags: ['Java', 'Fault Tolerance', 'System Design', 'Algorithms', 'Error Handling', 'Data Integrity', 'Software Engineering'],
      image: `${publicBase}pictures/Fault-Tolerant Data Processing & Resilient Logging System.jpg`,
      featured: false,
      timeline: '3 weeks',
      team: '1 person',
      impact: [
        'Graceful handling of sensor failures',
        'Practical majority voting implementation',
        'Resilient multi-level fallback logging',
        'Validated via tests and randomized simulation'
      ],
      gallery: [],
      startDate: '2025-06-01',
      endDate: '2025-06-21'
    },
    {
      id: 'hybrid-antenna-ml-2025',
      title: 'A Hybrid Machine Learning Framework for Antenna Design Optimization',
      description:
        'Published research integrating fuzzy clustering with supervised classification, achieving up to 99.21% accuracy.',
      longDescription:
        'This research introduces a two-stage hybrid ML framework to overcome limitations of manual threshold-based labeling in antenna design optimization. First, unsupervised Fuzzy C-Means (FCM) discovers performance clusters (Low/Medium/High) from engineered EM and geometric features (Wavelength, Normalized Patch Dimensions, Aspect Ratio, Slot-to-Patch Ratio).\n\nThen, supervised models (KNN, Random Forest, Gradient Boosting, SVM, Naive Bayes) are trained on both the fuzzy-generated and manual labels to compare performance. The fuzzy-clustered labels yield balanced classes and markedly better results.\n\nKey Features & Technical Details:\n• Advanced Feature Engineering: EM and geometric features crafted to enrich model inputs\n• Unsupervised Fuzzy Clustering (FCM): Data-driven class discovery into Low/Medium/High performance groups\n• Supervised Model Suite: KNN, RF, GB, SVM, NB trained on both fuzzy and manual labels\n• Comparative Analysis: KNN peaks at 99.21% with fuzzy labels; manual labels cause imbalance and degrade accuracy\n\nProject Impact & Objective:\n• Peer-reviewed publication demonstrating a superior alternative to manual labeling\n• Strong evidence that unsupervised labeling produces balanced, meaningful classes\n• Framework identifies high-performance antenna designs more reliably, enabling efficient optimization',
      category: 'ml',
      tags: ['Machine Learning', 'Research', 'Data Science', 'Feature Engineering', 'Clustering', 'Supervised Learning', 'Python', 'Data Analysis'],
      image: `${publicBase}pictures/A Hybrid Machine Learning Framework for Antenna Design Optimization.jpg`,
      featured: false,
      timeline: '3 months',
      team: '2 people',
      impact: [
        'Peer-reviewed publication',
        '99.21% best accuracy with fuzzy labels',
        'Demonstrated superiority over manual thresholding'
      ],
      gallery: [],
      startDate: '2025-03-01',
      endDate: '2025-05-31'
    },
    {
      id: 'hybrid-ffnn-ga-5g-2025',
      title: 'A Hybrid Deep Learning-Genetic Algorithm Approach for 5G Beam Selection',
      description:
        'Published hybrid FFNN+GA model for 5G beam selection; boosted accuracy to 98% over standalone FFNN.',
      longDescription:
        'This research targets efficient downlink beam selection in 5G Massive MIMO, balancing accuracy and latency. Three strategies were benchmarked in a simulated LoS environment: a fast Feedforward Neural Network (FFNN), a Genetic Algorithm (GA), and a hybrid FFNN-GA model. The hybrid workflow first uses an FFNN for rapid prediction and then launches a constrained GA search in a small window around the predicted beam to refine the choice. Results were compared to the theoretical optimum (exhaustive search) to analyze accuracy-latency trade-offs.\n\nKey Features & Technical Details\n• Standalone FFNN Baseline: 87.65% accuracy with ~55 µs per-sample latency for real-time suitability.\n• Novel Hybrid FFNN-GA: FFNN narrows the search; GA refines within a small codebook window to reach 98.00% accuracy.\n• Trade-off Analysis: For a small 36-beam codebook, GA overhead can exceed exhaustive search; hybrid advantages grow with larger spaces.\n\nProject Impact & Objective\n• Peer-reviewed publication advancing AI for 5G telecommunications.\n• Designed a hybrid DL-GA framework that outperforms single-model baselines.\n• Delivered a clear, data-driven analysis of accuracy vs. latency for different operating regimes.',
      category: 'ml',
      tags: ['Deep Learning', 'Genetic Algorithm', 'MATLAB', '5G', 'Optimization', 'Research', 'Hybrid Models'],
      image: `${publicBase}pictures/A Hybrid Deep Learning-Genetic Algorithm Approach for 5G Beam Selection.jpg`,
      featured: true,
      timeline: '3 months',
      team: '2 people',
      impact: [
        'Peer-reviewed contribution to AI for 5G',
        'Hybrid model improved accuracy to 98%',
        'Comprehensive accuracy-latency trade-off study'
      ],
      gallery: [],
      startDate: '2025-07-01',
      endDate: '2025-09-30'
    },
    {
      id: 'vanet-ids-2025',
      title: 'Machine Learning Framework for VANET Intrusion Detection',
      description:
        'Published ML framework for VANET security with enhanced K-means and classifier benchmarking; high detection, low false positives.',
      longDescription:
        'As Vehicular Ad-Hoc Networks (VANETs) grow, so do cyber threats. This research presents a practical ML-based IDS that detects and classifies attacks (e.g., DDoS, Replay, Sybil) from traffic features. A novel, enhanced K-means clustering algorithm provides robust, data-driven grouping; supervised classifiers are then benchmarked to identify top detection models. Experiments on public datasets ensure repeatability and verification.\n\nKey Features & Technical Details\n• Enhanced K-means Clustering: Deterministic, two-step centroid initialization for improved accuracy; clusters formed using KPIs like PDR, Jitter, Throughput.\n• Intelligent Attack Labeling: Cluster MSE analysis maps clusters to attack types; high-MSE clusters flagged as likely DDoS, stable clusters mapped to normal/Sybil, etc.\n• Classifier Benchmarking: Models including Random Forest, MLP, J48, REP Tree, Naive Bayes trained and evaluated with TPR/FPR per attack type.\n• Superior Performance: J48 and Random Forest lead with average TPR ≈ 0.88 and very low FPR, balancing detection and false alarms.\n\nProject Impact & Objective\n• Peer-reviewed publication proposing a verifiable, high-performance IDS for VANETs.\n• Enhanced K-means tailored to network traffic anomaly detection.\n• Rigorous model comparison to select effective classifiers for deployment.',
      category: 'security',
      tags: ['Machine Learning', 'Network Security', 'Intrusion Detection', 'Clustering', 'Research', 'Data Analysis'],
      image: `${publicBase}pictures/Machine Learning Framework for VANET Intrusion Detection.jpg`,
      featured: false,
      timeline: '3 months',
      team: '2 people',
      impact: [
        'Published peer-reviewed security methodology',
        'Enhanced K-means for anomaly detection',
        'Comprehensive ML classifier benchmarking',
        'Average TPR ~0.88 with low FPR'
      ],
      gallery: [],
      startDate: '2025-01-01',
      endDate: '2025-03-31'
    },
    {
      id: 'hardware-vanet-ids-2025',
      title: 'Hardware-Accelerated Intrusion Detection System for VANETs',
      description:
        'Real-time VANET IDS on Raspberry Pi 5 using Random Forest (99.72% accuracy) with protocol benchmarking (MQTT, CoAP, AMQP, TCP, UDP).',
      longDescription:
        'This practical project implements a real-time IDS for VANETs on Raspberry Pi 5, moving beyond pure simulation. Multiple ad hoc WiFi nodes simulate vehicles publishing via MQTT. A central subscriber intercepts traffic and classifies messages in real time using a trained ML model. Two investigations were conducted: selecting the most accurate ML model and benchmarking five communication protocols for suitability.\n\nKey Features & Technical Details\n• Hardware-in-the-Loop Simulation: Raspberry Pi 5 with six USB WiFi modules forms a realistic ad hoc wireless network to evaluate CPU/memory, latency, and jitter on constrained hardware.\n• High-Accuracy IDS Model: Random Forest trained on NSL-KDD achieved 99.72% accuracy (Precision 99.18%, Recall 99.55%), classifying multiple attack types (DoS, Probe, R2L, etc.).\n• Protocol Benchmarking: MQTT, CoAP, AMQP, TCP, UDP evaluated across 1-6 clients; MQTT provided the best balance of latency, jitter, resource use, and scalability.\n\nProject Impact & Objective\n• Built a complete hardware+software IDS prototype for VANETs.\n• Delivered state-of-the-art detection accuracy and a data-driven protocol recommendation (MQTT).\n• Under peer review, underscoring novelty and practical significance.',
      category: 'iot',
      tags: ['Machine Learning', 'Cybersecurity', 'IoT', 'Raspberry Pi', 'Python', 'Network Protocols', 'Real-Time Systems'],
      image: `${publicBase}pictures/Hardware-Accelerated Intrusion Detection System for VANETs.jpg`,
      featured: true,
      timeline: '6 months',
      team: '2 people',
      impact: [
        'Physical VANET IDS prototype on Raspberry Pi 5',
        '99.72% Random Forest detection accuracy',
        'MQTT identified as optimal protocol via benchmark'
      ],
      gallery: [],
      startDate: '2025-02-01',
      endDate: '2025-07-31'
    },
    {
      id: 'smartspot-iot-parking-2025',
      title: 'Smart IoT Parking Management System (SmartSpot)',
      description:
        'End-to-end smart parking using ESP32 sensors and a Python NPR pipeline; real-time cloud dashboard with 92% accuracy.',
      longDescription:
        'SmartSpot is a prototype-to-production smart parking solution integrating hardware, intelligent software, and cloud services. An ESP32 manages on-site edge hardware (HC-SR04 ultrasonic sensors, barrier servos, OLED display) while a host computer runs a Python-based Number Plate Recognition (NPR) pipeline using OpenCV, EAST text detection, and pyTesseract OCR. A custom debouncing state machine requires consistent plate reads for ~1.3s to slash false positives from ~25% to <2%. All events (entries/exits, bay occupancy) are logged to Google Sheets via gspread and visualized on a live web dashboard, including history search and heatmaps. The project progressed from breadboard to a KiCad-designed PCB, demonstrating a full lifecycle.\n\nKey Features & Technical Details\n• Intelligent NPR: OpenCV + EAST + pyTesseract with a debounced acceptance state machine (<2% false positives).\n• Distributed Architecture: ESP32 handles real-time control; host PC runs compute-heavy NPR to keep the edge responsive.\n• Real-Time Cloud & Dashboard: Instant Google Sheets logging powers a live web dashboard with analytics.\n• From Prototype to PCB: Evolved from breadboard to custom KiCad PCB for robust deployment.\n\nProject Impact & Objective\n• Designed and validated an advanced, user-centric smart parking system.\n• 92% first-try NPR accuracy under ideal conditions.\n• End-to-end latency measured at ~1.8-2.5s from stop to barrier open.\n• Complete physical prototype across embedded, CV, and cloud.',
      category: 'iot',
      tags: ['IoT', 'ESP32', 'Python', 'OpenCV', 'Computer Vision', 'Cloud Integration', 'Hardware Design', 'PCB Design'],
      image: `${publicBase}pictures/Smart IoT Parking Management System (SmartSpot).jpg`,
      featured: false,
      timeline: '6 months',
      team: '4 people',
      impact: [
        '92% NPR accuracy; <2% false positives',
        '1.8-2.5s end-to-end latency',
        'Google Sheets powered live dashboard',
        'Custom KiCad PCB from prototype'
      ],
      gallery: [],
      startDate: '2024-09-01',
      endDate: '2025-02-28'
    },
    {
      id: 'erc-ugv-2025',
      title: 'Autonomous Waste Collection Robot (ERC 2025)',
      description:
        'ROS-based autonomous UGV with deep-learning vision and a custom forklift-style mechanism for trash collection.',
      longDescription:
        'Built for the Emirates Robotics Competition 2025, this is an end-to-end autonomous UGV that navigates, detects waste, collects it, and deposits into bins. ROS provides the core navigation (gmapping SLAM, amcl localization, move_base planning/avoidance with 2D LiDAR). A fine-tuned MobileNetV2 model (TensorFlow/Keras) performs real-time detection; images are preprocessed (BGR to HSV) for robust color separation. A custom, forklift-inspired lifting mechanism engineered from LEGO Technic, a repurposed continuous track, DC motors, and an H-Bridge delivers stable scoop, lift, and deposit operations. Custom ROS nodes integrate perception, navigation, and actuation: detections are published; a control node consumes them, sends goals to move_base, and actuates the lifter to complete pickup and disposal autonomously.\n\nKey Features & Technical Details\n• Autonomous Navigation & Mapping (ROS): gmapping SLAM, amcl localization, and move_base path planning/avoidance using 2D LiDAR.\n• Deep Learning Vision: MobileNetV2 real-time detection pipeline with HSV preprocessing for robust color segmentation.\n• Custom Forklift Mechanism: Iteratively designed lifting system offering stability and load management under DC motor control.\n• Full System Integration: ROS nodes bridge perception→navigation→manipulation for closed-loop autonomous collection.\n\nProject Impact & Objective\n• End-to-end system integrating navigation, perception, and manipulation.\n• Robust ROS nav stack operation in dynamic environments.\n• Reliable lifting mechanism after iterative mechanical design.\n• AI-driven sorting of detected waste items.',
      category: 'autonomy',
      tags: ['Robotics', 'ROS', 'Computer Vision', 'Deep Learning', 'Mechanical Design', 'System Integration', 'Python'],
      image: `${publicBase}pictures/Autonomous Waste Collection Robot (ERC 2025).jpg`,
      featured: true,
      timeline: '7 months',
      team: '5 people',
      impact: [
        'Complete autonomous UGV for ERC 2025',
        'ROS SLAM + navigation with LiDAR',
        'MobileNetV2 real-time detection',
        'Custom forklift-style lifter'
      ],
      gallery: [],
      startDate: '2025-01-01',
      endDate: '2025-07-31'
    },
    {
      id: 'digital-currency-exchange-2023',
      title: 'Digital Currency Exchange Calculator',
      description:
        'Digital logic circuit in Multisim performing currency conversion with a custom 4x4 multiplier and optimized routing.',
      longDescription:
        'This project designed, implemented, and simulated a combinational logic circuit for hardware-only currency exchange computations. Built in Multisim from standard logic gates, it accepts a 4-bit USD amount and a 2-bit selector for target currency (AED, SEK, HKD, NZD), then outputs an 8-bit converted value. Subsystems include input switches, a 2-to-4 decoder, routing logic, a hand-built 4x4 binary multiplier from Half/Full Adders, and output probes, integrated into a cohesive system for real-time observation.\n\nKey Features & Technical Details\n• Custom 4x4 Binary Multiplier: Constructed from Half Adders and Full Adders; generates partial products and sums them to produce the final result.\n• Optimized Routing Mechanism: A 2-to-4 decoder and AND/OR gating select a hard-coded conversion rate into a shared multiplier, avoiding four separate multipliers and reducing gate count.\n• Complete System Integration: Inputs, decoder, routing, multiplier, and output probes integrated and simulated in Multisim for interactive testing.\n\nProject Impact & Objective\n• Demonstrated practical digital design by building complex arithmetic from basic components.\n• Engineered hardware reuse via routing to minimize complexity.\n• Gained hands-on proficiency with Multisim for design, testing, and validation.',
      category: 'embedded',
      tags: ['Digital Logic Design', 'Hardware Design', 'Circuit Design', 'Multisim', 'Combinational Logic', 'Arithmetic Circuits'],
      image: `${publicBase}pictures/Digital Currency Exchange Calculator.jpg`,
      featured: false,
      timeline: '2 months',
      team: '2 people',
      impact: [
        'Complete hardware arithmetic system in Multisim',
        'Custom 4x4 multiplier from first principles',
        'Optimized gate count via routing and decoding'
      ],
      gallery: [],
      startDate: '2023-08-01',
      endDate: '2023-09-30'
    },
    {
      id: 'touch-ab-amp-2024',
      title: 'Touch-Controlled Class AB Power Amplifier',
      description:
        'Designed, simulated, and built a touch-activated switch controlling a Class AB power amplifier from breadboard to soldered perfboard.',
      longDescription:
        'This project was a comprehensive, hands-on exploration of analog circuit design, integrating a transistor-based touch switch with a Class AB power amplifier. The workflow followed an engineering lifecycle: Multisim simulation, breadboard prototyping, and a robust final build on a soldered perfboard. A key study compared performance between the temporary breadboard and the soldered implementation.\n\nKey Features & Technical Details\n• Bipolar Transistor Touch Switch: Combined NPN/PNP stages responded to both positive and negative AC cycles (1 Hz), acting akin to a full-wave rectifier that alternately illuminated two LEDs to confirm bipolar operation.\n• Class AB Power Amplifier: Built around an LM741 op-amp to target a voltage gain of −9. Used a complementary NPN/PNP transistor pair and diode biasing to minimize crossover distortion typical in Class B designs. Oscilloscope measurements confirmed ~−8.87 gain.\n• System Integration & Comparison: Integrated touch switch and amplifier into a cohesive system and compared breadboard vs. soldered perfboard behavior. Breadboard exhibited distortion/instability; soldered version improved signal integrity, stability, and noise performance.\n\nProject Impact & Objective\n• Applied foundational analog theory to a multi-stage practical build.\n• Completed full cycle from simulation to prototyping to soldered implementation.\n• Demonstrated deep understanding of transistor/op-amp behavior and troubleshooting real issues (faulty parts, shorts, noise).',
      category: 'analog',
      tags: ['Analog Electronics', 'Circuit Design', 'Multisim', 'Prototyping', 'PCB Soldering', 'Transistors', 'Op-Amps', 'Troubleshooting'],
      image: `${publicBase}pictures/Touch-Controlled Class AB Power Amplifier.jpg`,
      featured: false,
      timeline: '1 month (January 2024)',
      team: '2 members',
      impact: [
        'Multi-stage analog system from concept to final hardware',
        'Touch switch + Class AB amplifier integrated and validated',
        'Measured −8.87 gain with minimized crossover distortion',
        'Significant stability/noise improvements on soldered build'
      ],
      gallery: [],
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: 'webots-maze-light-2024',
      title: 'Autonomous Maze-Solving Robot with Light-Seeking Behavior',
      description:
        'Webots e-puck robot in C that solves a maze via wall-following, logs light levels, and returns to the brightest location.',
      longDescription:
        'Designed and implemented an autonomous agent in Webots using the e-puck robot and the C API. The robot completes a two-phase mission: (1) explore and solve an unknown maze using a reactive wall-following algorithm driven by its IR distance sensors, and (2) analyze logged light sensor data to navigate back to the highest-intensity location after maze completion. The controller uses differential drive control and modular logic for sensing, actuation, and data handling.\n\nKey Features & Technical Details\n• Reactive Wall-Following Algorithm: Rule-based logic using eight IR sensors to handle four scenarios: wall ahead (turn), wall on side (follow left wall), corridor (centered forward), open path (forward with slight right bias).\n• Light-Seeking with Data Logging: Continuously samples eight light sensors and stores readings with position/path context; on completion, identifies the peak intensity and drives back to that location using recorded path history.\n• Webots C API Control: wb_motor_set_velocity for differential drive; wb_distance_sensor_get_value and wb_light_sensor_get_value for perception; wb_led_set for completion indication and status.\n\nProject Impact & Objective\n• Robust maze solving without a priori map using reactive control.\n• Dual-objective mission combining exploration with intelligent return behavior.\n• Hands-on proficiency with Webots simulation and C-based robotics development.\n• Iterative debugging and modular design improved sensor logic and data handling.',
      category: 'robotics-sim',
      tags: ['Robotics', 'Simulation', 'Webots', 'C', 'Algorithms', 'Path Planning', 'Sensor Integration', 'Control Systems'],
      image: `${publicBase}pictures/Autonomous Maze-Solving Robot with Light-Seeking Behavior.jpg`,
      featured: false,
      timeline: '1 month (September 2024)',
      team: '2 members',
      impact: [
        'Implemented reliable wall-following in dynamic mazes',
        'Logged and analyzed environmental light data',
        'Autonomous return to brightest location using path history',
        'Developed with Webots e-puck and C API'
      ],
      gallery: [],
      startDate: '2024-09-01',
      endDate: '2024-09-30'
    },
    {
      id: 'enterprise-network-2024',
      title: 'Multi-Site Enterprise Network Design & Implementation',
      description:
        'Secure, scalable two-site enterprise network with IPsec VPN, DMZ, and hierarchical star topology.',
      longDescription:
        'Comprehensive redesign and implementation of a multi-office enterprise network. The architecture employs a hierarchical star topology with per-office subnets connected to a central router for scalable performance and easier management. A site-to-site IPsec VPN (ISAKMP policies, AES-256/SHA transform sets, ACL-defined interesting traffic) securely links the Dubai and Abu Dhabi offices. A dedicated DMZ hosts public-facing servers, isolating them from the trusted LAN to harden the posture. Cisco IOS configurations covered router interfaces and addressing, static and RIP routing for reachability, and multilayer switch setup to support higher traffic and future VLAN segmentation.\n\nKey Features & Technical Details\n• Hierarchical Star Topology: Structured, scalable design with subnet isolation per office.\n• Secure IPsec VPN: ISAKMP policy, AES-256/SHA transforms, ACLs for encrypted inter-office traffic.\n• Multi-Zone Security (DMZ): Public server segment isolated from internal LAN.\n• Cisco IOS Configuration: Router interface/IP setup, static + RIP routing, multilayer switch configuration.\n\nProject Impact & Objective\n• Replaced an outdated network with a secure, high-performance foundation.\n• Seamless, protected collaboration between sites via VPN.\n• Hardened infrastructure with segmentation and DMZ.\n• Prepared for cloud (Azure) and future VoIP rollout.',
      category: 'neteng',
      tags: ['Network Design', 'Network Security', 'Cisco IOS', 'VPN', 'Routing & Switching', 'Cloud Integration', 'VoIP'],
      image: '',
      featured: true,
      timeline: '1 month',
      team: '1 person',
      impact: [
        'Modern, manageable multi-site topology',
        'Encrypted site-to-site connectivity',
        'DMZ isolation for public services',
        'Future-ready for cloud and VoIP'
      ],
      gallery: [],
      startDate: '2024-09-01',
      endDate: '2024-09-30'
    }
  ];

  const filteredProjects = 
    activeCategory === 'all' 
    ? projects 
      : activeCategory === 'featured'
        ? projects.filter(project => project.featured)
    : projects.filter(project => project.category === activeCategory);

  // Sort by endDate/startDate desc (newest first)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aDate = new Date(a.endDate || a.startDate || '1970-01-01').getTime();
    const bDate = new Date(b.endDate || b.startDate || '1970-01-01').getTime();
    return bDate - aDate;
  });

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Projects</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Innovative solutions across engineering, robotics, cybersecurity, and signal processing
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 ${
                activeCategory === category.id 
                  ? 'btn-hero' 
                  : 'hover:border-primary hover:text-primary'
              }`}
            >
              {category.icon}
              <span className="relative z-10">{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Projects Grid or Empty State */}
        {sortedProjects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Card className="p-10 text-center border-dashed">
              <h3 className="text-xl font-semibold text-foreground mb-2">Projects coming soon</h3>
              <p className="text-muted-foreground">We’re setting things up. Check back shortly.</p>
            </Card>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Mobile: horizontal carousel */}
            <div className="sm:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 scroll-smooth">
              <div className="flex gap-4 w-[100%] pr-4 pl-4">
                {sortedProjects.slice(0, visibleProjects).map((project, index) => (
                  <div key={project.id} className="min-w-[92%] snap-start mr-2">
                    <Card
                      id={project.id}
                      data-title={project.title}
                      className="project-card overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="aspect-video bg-muted bg-cover bg-center relative overflow-hidden">
                        <img
                          src={project.image || ''}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          data-variants={getTitleBases(project.title, project.image).join('|')}
                          data-vidx="0"
                          data-eidx="0"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                            const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                            let vIdx = Number(img.getAttribute('data-vidx') || '0');
                            let eIdx = Number(img.getAttribute('data-eidx') || '0');
                            eIdx += 1;
                            if (eIdx >= exts.length) {
                              eIdx = 0;
                              vIdx += 1;
                            }
                            if (vIdx < variants.length) {
                              img.setAttribute('data-vidx', String(vIdx));
                              img.setAttribute('data-eidx', String(eIdx));
                              img.src = `${variants[vIdx]}${exts[eIdx]}`;
                              return;
                            }
                            img.style.display = 'none';
                            const parent = img.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground text-sm';
                              fallback.textContent = 'No image provided';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                {/* Peek of next card to indicate swipe */}
                <div className="min-w-[8%] opacity-70 flex items-center justify-center">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">Swipe to see more</div>
            </div>

            {/* Desktop grid */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
              {sortedProjects.slice(0, visibleProjects).map((project, index) => (
                <Card
                  id={project.id}
                  data-title={project.title}
                  key={project.id}
                  className="project-card overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video bg-muted bg-cover bg-center relative overflow-hidden">
                    <img
                      src={project.image || ''}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      data-variants={getTitleBases(project.title, project.image).join('|')}
                      data-vidx="0"
                      data-eidx="0"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                        let vIdx = Number(img.getAttribute('data-vidx') || '0');
                        let eIdx = Number(img.getAttribute('data-eidx') || '0');
                        eIdx += 1;
                        if (eIdx >= exts.length) {
                          eIdx = 0;
                          vIdx += 1;
                        }
                        if (vIdx < variants.length) {
                          img.setAttribute('data-vidx', String(vIdx));
                          img.setAttribute('data-eidx', String(eIdx));
                          img.src = `${variants[vIdx]}${exts[eIdx]}`;
                          return;
                        }
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground text-sm';
                          fallback.textContent = 'No image provided';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.github && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                        {project.demo && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="btn-hero px-4 py-2 text-sm"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {sortedProjects.length > visibleProjects && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setVisibleProjects(prev => prev + 6)}
                  className="btn-hero px-8 py-3 text-lg"
                  size="lg"
                >
                  Load More Projects
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Project Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedProject(null)}
          >
            <Card
              className="max-w-6xl w-full max-h-[95vh] overflow-y-auto border-2 border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header */}
                <div className="p-8 border-b border-border">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold text-foreground mb-3 leading-tight">
                        {selectedProject.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedProject.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                      className="text-muted-foreground hover:text-foreground ml-4"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Timeline</div>
                      <div className="font-semibold text-foreground">{selectedProject.timeline}</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-5 w-5 text-secondary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Team</div>
                      <div className="font-semibold text-foreground">{selectedProject.team}</div>
                    </div>
                    <div className="text-center">
                      <Target className="h-5 w-5 text-accent mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-semibold text-foreground capitalize">{selectedProject.category}</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Main Image */}
                  <div className="aspect-video bg-muted rounded-lg mb-8 overflow-hidden">
                    <img 
                      src={selectedProject.image || ''} 
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      data-variants={getTitleBases(selectedProject.title, selectedProject.image).join('|')}
                      data-vidx="0"
                      data-eidx="0"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                        let vIdx = Number(img.getAttribute('data-vidx') || '0');
                        let eIdx = Number(img.getAttribute('data-eidx') || '0');
                        eIdx += 1;
                        if (eIdx >= exts.length) {
                          eIdx = 0;
                          vIdx += 1;
                        }
                        if (vIdx < variants.length) {
                          img.setAttribute('data-vidx', String(vIdx));
                          img.setAttribute('data-eidx', String(eIdx));
                          img.src = `${variants[vIdx]}${exts[eIdx]}`;
                          return;
                        }
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground';
                          fallback.textContent = 'No image provided';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Description and Impact */}
                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Project Overview</h4>
                      <div className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                        {selectedProject.longDescription}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Key Impact</h4>
                      <div className="space-y-3">
                        {selectedProject.impact.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {selectedProject.github && (
                      <Button className="btn-hero">
                        <Github className="h-5 w-5 mr-2" />
                        <span className="relative z-10">View Code</span>
                      </Button>
                    )}
                    {selectedProject.demo && (
                      <Button variant="outline" className="btn-cyber">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        <span className="relative z-10">Live Demo</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;