'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { FormValues } from '@/lib/schemas';
import { formSchema } from '@/lib/schemas';
import fs from 'fs/promises';
import path from 'path';

export interface ProblemStatement {
  sNo: number;
  organization: string;
  title: string;
  category: 'Software' | 'Hardware';
  psNumber: string;
  theme: string;
}

// In-memory store for problem statements and registrations
let problemStatementsStore: ProblemStatement[] = [
    {
        sNo: 1,
        organization: "Ministry of Development of North Eastern Region",
        title: "Smart Community Health Monitoring and Early Warning System for Water-Borne Diseases in Rural Northeast India",
        category: "Software",
        psNumber: "SIH25001",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 2,
        organization: "Ministry of Development of North Eastern Region",
        title: "Smart Tourist Safety Monitoring & Incident Response System using Al, Geo-Fencing, and Blockchain-based Digital ID",
        category: "Software",
        psNumber: "SIH25002",
        theme: "Travel & Tourism",
    },
    {
        sNo: 3,
        organization: "Ministry of Development of North Eastern Region",
        title: "Low-Cost smart transportation solution for Agri produce from remote farms to nearest motorable road in NER Region",
        category: "Hardware",
        psNumber: "SIH25003",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 4,
        organization: "Ministry of Fisheries, Animal Husbandry & Dairying",
        title: "lmage based breed recognition for cattle and buffaloes of India",
        category: "Software",
        psNumber: "SIH25004",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 5,
        organization: "Ministry of Fisheries, Animal Husbandry & Dairying",
        title: "lmage based Animal Type Classification for cattle and buffaloes",
        category: "Software",
        psNumber: "SIH25005",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 6,
        organization: "Ministry of Fisheries, Animal Husbandry & Dairying",
        title: "Development of a Digital Farm Management Portal for lmplementing Biosecurity ileasures in Pig and Poultry Farms",
        category: "Software",
        psNumber: "SIH25006",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 7,
        organization: "Ministry of Fisheries, Animal Husbandry & Dairying",
        title: "Development of a Digital Farm Management Portal for Monitoring aximum Residue Limits (MRL) and Antimicrobial Usage (AMU) in Livestock",
        category: "Software",
        psNumber: "SIH25007",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 8,
        organization: "Government of Punjab",
        title: "Disaster Preparedness and Response Education System for Schools and Colleges",
        category: "Software",
        psNumber: "SIH25008",
        theme: "Disaster Management",
    },
    {
        sNo: 9,
        organization: "Government of Punjab",
        title: "Gamified Environmental Education Platform for Schools and Colleges",
        category: "Software",
        psNumber: "SIH25009",
        theme: "Smart Education",
    },
    {
        sNo: 10,
        organization: "Government of Punjab",
        title: "Smart Crop Advisory System for Small and Marginal Farmers",
        category: "Software",
        psNumber: "SIH25010",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 11,
        organization: "Government of Punjab",
        title: "Smart Curriculum Activity & Attendance App",
        category: "Software",
        psNumber: "SIH25011",
        theme: "Smart Education",
    },
    {
        sNo: 12,
        organization: "Government of Punjab",
        title: "Automated Attendance System for Rural Schools",
        category: "Software",
        psNumber: "SIH25012",
        theme: "Smart Education",
    },
    {
        sNo: 13,
        organization: "Government of Punjab",
        title: "Real-Time Public Transport Tracking for Small Cities",
        category: "Software",
        psNumber: "SIH25013",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 14,
        organization: "Government of Punjab",
        title: "Waste Segregation Monitoring System for Urban Local Bodies",
        category: "Hardware",
        psNumber: "SIH25014",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 15,
        organization: "Government of Punjab",
        title: "Intelligent Pesticide Sprinkling System Determined by the Infection Level of a Plant",
        category: "Hardware",
        psNumber: "SIH25015",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 16,
        organization: "Government of Punjab",
        title: "Automated Student Attendance Monitoring and Analytics System for Colleges",
        category: "Software",
        psNumber: "SIH25016",
        theme: "Smart Education",
    },
    {
        sNo: 17,
        organization: "Government of Punjab",
        title: "Digital Platform for Centralized Alumni Data Management and Engagement",
        category: "Software",
        psNumber: "SIH25017",
        theme: "Smart Education",
    },
    {
        sNo: 18,
        organization: "Government of Punjab",
        title: "Telemedicine Access for Rural Healthcare in Nabha",
        category: "Software",
        psNumber: "SIH25018",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 19,
        organization: "Government of Punjab",
        title: "Digital Learning Platform for Rural School Students in Nabha",
        category: "Software",
        psNumber: "SIH25019",
        theme: "Smart Education",
    },
    {
        sNo: 20,
        organization: "Ministry of Railways",
        title: "Development of indigenous contactless Integrated Track Monitoring Systems (ITMS) for Track Recording on Indian Railways",
        category: "Hardware",
        psNumber: "SIH25020",
        theme: "Smart Automation",
    },
    {
        sNo: 21,
        organization: "Ministry of Railways",
        title: "AI based development of Laser based QR Code marking on 'track fittings on Indian Railways'.",
        category: "Hardware",
        psNumber: "SIH25021",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 22,
        organization: "Ministry of Railways",
        title: "Maximizing Section Throughput Using Al-Powered Precise Train Traffic Control",
        category: "Software",
        psNumber: "SIH25022",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 23,
        organization: "Ministry of Ayush",
        title: "AyurSutra- Panchakarma Patient Management and therapy scheduling Software",
        category: "Software",
        psNumber: "SIH25023",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 24,
        organization: "Ministry of Ayush",
        title: "Comprehensive Cloud-Based Practice Management & Nutrient Analysis Software for Ayurvedic Dietitians, Tailored for Ayurveda-Focused Diet Plans",
        category: "Software",
        psNumber: "SIH25024",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 25,
        organization: "Ministry of Ayush",
        title: "E tongue for Dravya identification",
        category: "Hardware",
        psNumber: "SIH25025",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 26,
        organization: "Ministry of Ayush",
        title: "Develop API code to integrate NAMASTE and or the International Classification of Diseases (ICD-11) via the Traditional Medicine Module 2 (TM2) into existing EMR systems that comply with Electronic Health Record (EHR) Standards for India.",
        category: "Software",
        psNumber: "SIH25026",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 27,
        organization: "Ministry of Ayush",
        title: "Develop a blockchain-based system for botanical traceability of Ayurvedic herbs, including geo-tagging from the point of collection (farmers/wild collectors) to the final Ayurvedic formulation label.",
        category: "Software",
        psNumber: "SIH25027",
        theme: "Blockchain & Cybersecurity",
    },
    {
        sNo: 28,
        organization: "Government of Jharkhand",
        title: "Smart Classroom & Timetable Scheduler",
        category: "Software",
        psNumber: "SIH25028",
        theme: "Smart Education",
    },
    {
        sNo: 29,
        organization: "Government of Jharkhand",
        title: "Authenticity Validator for Academia",
        category: "Software",
        psNumber: "SIH25029",
        theme: "Smart Education",
    },
    {
        sNo: 30,
        organization: "Government of Jharkhand",
        title: "Al-Based Crop Recommendation for Farmers",
        category: "Software",
        psNumber: "SIH25030",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 31,
        organization: "Government of Jharkhand",
        title: "Crowdsourced Civic lssue Reporting and Resolution System",
        category: "Software",
        psNumber: "SIH25031",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 32,
        organization: "Government of Jharkhand",
        title: "Development of a Smart Digital Platform to Promote Eco & Cultural Tourism in Jharkhand",
        category: "Software",
        psNumber: "SIH25032",
        theme: "Travel & Tourism",
    },
    {
        sNo: 33,
        organization: "Ministry of Corporate Affairs",
        title: "Al-Based Smart Allocation Engine for PM Internship Scheme",
        category: "Software",
        psNumber: "SIH25033",
        theme: "Smart Automation",
    },
    {
        sNo: 34,
        organization: "Ministry of Corporate Affairs",
        title: "Al-Based Internship Recommendation Engine for PM Internship Scheme",
        category: "Software",
        psNumber: "SIH25034",
        theme: "Smart Education",
    },
    {
        sNo: 35,
        organization: "Ministry of Corporate Affairs",
        title: "Sentiment analysis of comments received through E-consultation module",
        category: "Software",
        psNumber: "SIH25035",
        theme: "Miscellaneous",
    },
    {
        sNo: 36,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Development of Sensor for Detection Of Microplastics",
        category: "Hardware",
        psNumber: "SIH25036",
        theme: "Miscellaneous",
    },
    {
        sNo: 37,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Development of a low-cost camera-based automated beach sand grain size mapping system",
        category: "Hardware",
        psNumber: "SIH25037",
        theme: "Miscellaneous",
    },
    {
        sNo: 38,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Blockchain-Based Blue Carbon Registry and MRV System",
        category: "Software",
        psNumber: "SIH25038",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 39,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics",
        category: "Software",
        psNumber: "SIH25039",
        theme: "Disaster Management",
    },
    {
        sNo: 40,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "FloatChat - AI-Powered Conversational Interface for ARGO Ocean Data Discovery and Visualization",
        category: "Software",
        psNumber: "SIH25040",
        theme: "Miscellaneous",
    },
    {
        sNo: 41,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "AI-Driven Unified Data Platform for Oceanographic, Fisheries, and Molecular Biodiversity Insights",
        category: "Software",
        psNumber: "SIH25041",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 42,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Identifying Taxonomy and Assessing Biodiversity from eDNA Datasets",
        category: "Software",
        psNumber: "SIH25042",
        theme: "Miscellaneous",
    },
    {
        sNo: 43,
        organization: "Ministry of Earth Sciences (MoES)",
        title: "Embedded Intelligent Microscopy System for Identification and Counting of Microscopic Marine Organisms",
        category: "Hardware",
        psNumber: "SIH25043",
        theme: "Smart Automation",
    },
    {
        sNo: 44,
        organization: "Government of Odisha",
        title: "Al-Powered Crop Yield Prediction and Optimization",
        category: "Software",
        psNumber: "SIH25044",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 45,
        organization: "Government of Odisha",
        title: "Blockchain-Based Supply Chain Transparency for Agricultural Produce",
        category: "Software",
        psNumber: "SIH25045",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 46,
        organization: "Government of Odisha",
        title: "Smart Waste Segregation and Recycling System",
        category: "Hardware",
        psNumber: "SIH25046",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 47,
        organization: "Government of Odisha",
        title: "Disaster Response Drone for Remote Areas",
        category: "Hardware",
        psNumber: "SIH25047",
        theme: "Robotics and Drones",
    },
    {
        sNo: 48,
        organization: "Government of Odisha",
        title: "Gamified Learning Platform for Rural Education",
        category: "Software",
        psNumber: "SIH25048",
        theme: "Smart Education",
    },
    {
        sNo: 49,
        organization: "Government of Odisha",
        title: "Al-Driven Public Health Chatbot for Disease Awareness",
        category: "Software",
        psNumber: "SIH25049",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 50,
        organization: "Government of Odisha",
        title: "Smart Traffic Management Systern for Urban Congestion",
        category: "Software",
        psNumber: "SIH25050",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 51,
        organization: "Government of Odisha",
        title: "Renewable Energy Monitoring System for Microgrids",
        category: "Hardware",
        psNumber: "SIH25051",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 52,
        organization: "Government of Odisha",
        title: "AR-Based Cultural Heritage Preservation Platform",
        category: "Software",
        psNumber: "SIH25052",
        theme: "Heritage & Culture",
    },
    {
        sNo: 53,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "Improved Onion storage technology for enhancing shelf life of onions",
        category: "Hardware",
        psNumber: "SIH25053",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 54,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "Automated High-Current Short-Circuit Test System for MCB to comply with IEC 60898-1:2015",
        category: "Hardware",
        psNumber: "SIH25054",
        theme: "Smart Automation",
    },
    {
        sNo: 55,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "Automated Specimen Preparation System for testing of Cable samples as per IS 10810 and IS 7098.",
        category: "Hardware",
        psNumber: "SIH25055",
        theme: "Miscellaneous",
    },
    {
        sNo: 56,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "To explore new/altermative assaying methods to the fire assay method for testing of gold jewellery and artefacts through non-destructive testing",
        category: "Hardware",
        psNumber: "SIH25056",
        theme: "Miscellaneous",
    },
    {
        sNo: 57,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "Automated Compliance Checker for Legal Metrology Declarations on E-Commerce Platforms",
        category: "Hardware",
        psNumber: "SIH25057",
        theme: "Miscellaneous",
    },
    {
        sNo: 58,
        organization: "Ministry of Consumer Affairs, Food & Public Distribution (MoCA,F&PD)",
        title: "Detection and Prevention of Tampering in Weighing and Measuring instruments",
        category: "Hardware",
        psNumber: "SIH25058",
        theme: "Miscellaneous",
    },
    {
        sNo: 59,
        organization: "Ministry of Social Justice & Empowerment (MoSJE)",
        title: "Enhancing Student Awareness on difference between Aadhaar linked and Direct Beneficiary Transfer(DBT) enabled Aadhaar seeded bank account.",
        category: "Software",
        psNumber: "SIH25059",
        theme: "Miscellaneous",
    },
    {
        sNo: 60,
        organization: "Ministry of Social Justice & Empowerment (MoSJE)",
        title: "Real life solutions for Waste Management.",
        category: "Software",
        psNumber: "SIH25060",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 61,
        organization: "Government of Sikkim",
        title: "Digitize and Showcase Monasteries of Sikkim for Tourism and Cultural Preservation",
        category: "Software",
        psNumber: "SIH25061",
        theme: "Travel & Tourism",
    },
    {
        sNo: 62,
        organization: "Government of Sikkim",
        title: "Implementation of Smart Agriculture for Efficient Cultivation in Hilly Regions",
        category: "Hardware",
        psNumber: "SIH25062",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 63,
        organization: "Government of Kerala",
        title: "Developing a cost effective solution for detecting the breakage of Low Voltage AC Distribution Over Head conductors",
        category: "Hardware",
        psNumber: "SIH25063",
        theme: "Disaster Management",
    },
    {
        sNo: 64,
        organization: "Government of Kerala",
        title: "Improving the Renewable Energy hosting capacity in Distribution Feeders improving the Power quality of Distribution network during high RE injection",
        category: "Hardware",
        psNumber: "SIH25064",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 65,
        organization: "Ministry of Jal Shakti",
        title: "Designing and development of an application for on spot assessment of Roof Top Rain water harvesting and artificial recharge potential and size of the RTRWH and AR.",
        category: "Software",
        psNumber: "SIH25065",
        theme: "Smart Automation",
    },
    {
        sNo: 66,
        organization: "Ministry of Jal Shakti",
        title: "Development of an Al-driven ChatBOT for INGRES as a virtuall assistant",
        category: "Software",
        psNumber: "SIH25066",
        theme: "Smart Automation",
    },
    {
        sNo: 67,
        organization: "Ministry of Jal Shakti",
        title: "Proposal for Design and development of application or Heavy Metal Pollution indices",
        category: "Software",
        psNumber: "SIH25067",
        theme: "Miscellaneous",
    },
    {
        sNo: 68,
        organization: "Ministry of Jal Shakti",
        title: "Real time Groundwater resource evaluation using DWLR data",
        category: "Software",
        psNumber: "SIH25068",
        theme: "Miscellaneous",
    },
    {
        sNo: 69,
        organization: "Ministry of Mines",
        title: "Al-Driven Life Cycle Assessment (LCA) Tool for Advancing Circulanty and Sustainability in Metallurgy and Mining",
        category: "Software",
        psNumber: "SIH25069",
        theme: "Miscellaneous",
    },
    {
        sNo: 70,
        organization: "Ministry of Mines",
        title: "Secure Data Wiping for Trustworthy IT Asset Recycling",
        category: "Software",
        psNumber: "SIH25070",
        theme: "Miscellaneous",
    },
    {
        sNo: 71,
        organization: "Ministry of Mines",
        title: "Al-Based Rockfall Prediction and Alert System for Open-Pit Mines",
        category: "Software",
        psNumber: "SIH25071",
        theme: "Disaster Management",
    },
    {
        sNo: 72,
        organization: "Ministry of Mines",
        title: "Design and Implementation of Solar-Powered Dewatering in Mining Operations.",
        category: "Hardware",
        psNumber: "SIH25072",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 73,
        organization: "Ministry of Youth Affairs and Sports",
        title: "Al-Powered Mobile Platform for Democratizing Sports Talent Assessment",
        category: "Software",
        psNumber: "SIH25073",
        theme: "Fitness & Sports",
    },
    {
        sNo: 74,
        organization: "Government of Kerala",
        title: "AI-Powered Personal Farming Assistant for Kerala Farmers",
        category: "Software",
        psNumber: "SIH25074",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 75,
        organization: "Government of Kerala",
        title: "Gamified Platform to Promote Sustainable Farming Practices",
        category: "Software",
        psNumber: "SIH25075",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 76,
        organization: "Government of Kerala",
        title: "AI-Based Farmer Query Support and Advisory System",
        category: "Software",
        psNumber: "SIH25076",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 77,
        organization: "Government of Kerala",
        title: "A hardware that can detect and prevent unauthorized use of electric fences",
        category: "Hardware",
        psNumber: "SIH25077",
        theme: "Smart Automation",
    },
    {
        sNo: 78,
        organization: "Government of Kerala",
        title: "Software other than a circuit breaker that can be used to detect and turn off LT lines when the line breaks",
        category: "Software",
        psNumber: "SIH25079",
        theme: "Disaster Management",
    },
    {
        sNo: 79,
        organization: "Government of Kerala",
        title: "Document Overload at Kochi Metro Rail Limited (KMRL)-An automated solution",
        category: "Software",
        psNumber: "SIH25080",
        theme: "Smart Automation",
    },
    {
        sNo: 80,
        organization: "Government of Kerala",
        title: "AI-Driven Train Induction Planning & Scheduling for Kochi Metro Rail Limited (KMRL)",
        category: "Software",
        psNumber: "SIH25081",
        theme: "Smart Automation",
    },
    {
        sNo: 81,
        organization: "Government of Kerala",
        title: "Development of a travel related software app that can be installed on mobile phones that could capture trip related information",
        category: "Software",
        psNumber: "SIH25082",
        theme: "Travel & Tourism",
    },
    {
        sNo: 82,
        organization: "Government of Kerala",
        title: "Digital Health Record Management System for migrant workers in Kerala aligned with sustainable development goals.",
        category: "Software",
        psNumber: "SIH25083",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 83,
        organization: "Government of Kerala",
        title: "Earthquake stabilised dialysis system for patient safety during seismic events.",
        category: "Hardware",
        psNumber: "SIH25084",
        theme: "Disaster Management",
    },
    {
        sNo: 84,
        organization: "Government of Kerala",
        title: "Solution for NON-REVENUE LOSS IN WATER SUPPLY Solution to improve AWARENESS IN WATER CONSERVATION TREATMENT OF WASTE WATER AND REUSE FOR DOMESTIC PURPOSES",
        category: "Hardware",
        psNumber: "SIH25085",
        theme: "Miscellaneous",
    },
    {
        sNo: 85,
        organization: "Government of Kerala",
        title: "GREY WATER MANAGEMENT AND REUSE WET LAND MANAGEMENT WATER CONSERVATION",
        category: "Hardware",
        psNumber: "SIH25090",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 86,
        organization: "Government of Jammu and Kashmir",
        title: "AI-Based Timetable Generation System aligned with NEP 2020 for Multidisciplinary Education Structures",
        category: "Software",
        psNumber: "SIH25091",
        theme: "Smart Automation",
    },
    {
        sNo: 87,
        organization: "Government of Jammu and Kashmir",
        title: "Development of a Digital Mental Health and Psychological Support System for Students in Higher Education",
        category: "Software",
        psNumber: "SIH25092",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 88,
        organization: "Government of Jammu and Kashmir",
        title: "Centralised Digital Platform for Comprehensive student activity record in HEIs",
        category: "Software",
        psNumber: "SIH25093",
        theme: "Smart Education",
    },
    {
        sNo: 89,
        organization: "Government of Jammu and Kashmir",
        title: "One-Stop Personalized Career & Education Advisor",
        category: "Software",
        psNumber: "SIH25094",
        theme: "Smart Education",
    },
    {
        sNo: 90,
        organization: "Autodesk",
        title: "Research and redesign a sport equipment commonly found in sport industry and utilize Fusion software to reimagine its design. Students can use Fusion Features such as Generative Design, Topology Optimization, Additive Build etc. The redesigned component should showcase innovation, enhanced functionality, and improved efficiency, all while being optimized for 3D printing.",
        category: "Hardware",
        psNumber: "SIH25095",
        theme: "Smart Education",
    },
    {
        sNo: 91,
        organization: "Autodesk",
        title: "• Students are supposed to use Fusion software to generate NC code with machine details & tool library for any industrial component. • Students should possess technical skills in areas such as CAD/CAM software, G-code programming, toolpath optimization, and machining fundamentals. Additionally, their project ideas should demonstrate a viable solution to a real-world problem, ensuring feasibility and practicality in implementation.",
        category: "Hardware",
        psNumber: "SIH25096",
        theme: "Smart Education",
    },
    {
        sNo: 92,
        organization: "Autodesk",
        title: "Research and develop a design on autonomous small precision focused machine for planting crops or weeding.",
        category: "Software",
        psNumber: "SIH25097",
        theme: "Smart Education",
    },
    {
        sNo: 93,
        organization: "Autodesk",
        title: "Students are tasked with designing a 4-story commercial office building using Revit Architecture and Revit Structure , ensuring effective integration between architectural and structural models in a BIM environment.(The size of the plot can be assumed by the students, all the dimensions wherever necessary can be assumed by students in mm units.)",
        category: "Software",
        psNumber: "SIH25098",
        theme: "Smart Education",
    },
    {
        sNo: 94,
        organization: "MathWorks India Pvt. Ltd.",
        title: "AI-powered monitoring of crop health, soil condition, and pest risks using multispectral/hyperspectral imaging and sensor data.",
        category: "Software",
        psNumber: "SIH25099",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 95,
        organization: "MathWorks India Pvt. Ltd.",
        title: "Accelerating High-Fidelity Road Network Modeling for Indian Traffic Simulations.",
        category: "Software",
        psNumber: "SIH25100",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 96,
        organization: "Government of Rajasthan",
        title: "Remote classroom for rural colleges",
        category: "Software",
        psNumber: "SIH25101",
        theme: "Smart Education",
    },
    {
        sNo: 97,
        organization: "Government of Rajasthan",
        title: "AI-based drop-out prediction and counseling system",
        category: "Software",
        psNumber: "SIH25102",
        theme: "Smart Automation",
    },
    {
        sNo: 98,
        organization: "Government of Rajasthan",
        title: "ERP-based Integrated Student Management system",
        category: "Software",
        psNumber: "SIH25103",
        theme: "Smart Automation",
    },
    {
        sNo: 99,
        organization: "Government of Rajasthan",
        title: "Language Agnostic Chatbot",
        category: "Software",
        psNumber: "SIH25104",
        theme: "Smart Education",
    },
    {
        sNo: 100,
        organization: "AICTE",
        title: "Develop computer programs (in any language, preferably Python) to identify the design principles behind the Kolam designs and recreate the kolams.",
        category: "Software",
        psNumber: "SIH12507",
        theme: "Heritage & Culture",
    },
    {
        sNo: 101,
        organization: "Ministry of Tribal Affairs(MoTA)",
        title: "Development of AI-powered FRA Atlas and WebGIS-based Decision Support System (DSS) for Integrated Monitoring of Forest Rights Act (FRA) Implementation. (States to be concentrated: Madhya Pradesh, Tripura , Odisha, Telangana)",
        category: "Software",
        psNumber: "SIH12508",
        theme: "Miscellaneous",
    },
    {
        sNo: 102,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25109",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 103,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25110",
        theme: "Blockchain & Cybersecurity",
    },
    {
        sNo: 104,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25111",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 105,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25112",
        theme: "Fitness & Sports",
    },
    {
        sNo: 106,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25113",
        theme: "Heritage & Culture",
    },
    {
        sNo: 107,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25114",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 108,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25115",
        theme: "Miscellaneous",
    },
    {
        sNo: 109,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25116",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 110,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25117",
        theme: "Robotics and Drones",
    },
    {
        sNo: 111,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25118",
        theme: "Smart Automation",
    },
    {
        sNo: 112,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25119",
        theme: "Smart Vehicles",
    },
    {
        sNo: 113,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25120",
        theme: "Travel & Tourism",
    },
    {
        sNo: 114,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25121",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 115,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25122",
        theme: "Disaster Management",
    },
    {
        sNo: 116,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25123",
        theme: "Smart Education",
    },
    {
        sNo: 117,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25124",
        theme: "Toys & Games",
    },
    {
        sNo: 118,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Hardware",
        psNumber: "SIH25125",
        theme: "Space Technology",
    },
    {
        sNo: 119,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25126",
        theme: "Agriculture, FoodTech & Rural Development",
    },
    {
        sNo: 120,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25127",
        theme: "Blockchain & Cybersecurity",
    },
    {
        sNo: 121,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25128",
        theme: "Clean & Green Technology",
    },
    {
        sNo: 122,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25129",
        theme: "Fitness & Sports",
    },
    {
        sNo: 123,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25130",
        theme: "Heritage & Culture",
    },
    {
        sNo: 124,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25131",
        theme: "MedTech / BioTech / HealthTech",
    },
    {
        sNo: 125,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25132",
        theme: "Miscellaneous",
    },
    {
        sNo: 126,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25133",
        theme: "Renewable / Sustainable Energy",
    },
    {
        sNo: 127,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25134",
        theme: "Robotics and Drones",
    },
    {
        sNo: 128,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25135",
        theme: "Smart Automation",
    },
    {
        sNo: 129,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25136",
        theme: "Smart Vehicles",
    },
    {
        sNo: 130,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25137",
        theme: "Travel & Tourism",
    },
    {
        sNo: 131,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25138",
        theme: "Transportation & Logistics",
    },
    {
        sNo: 132,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25139",
        theme: "Disaster Management",
    },
    {
        sNo: 133,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25140",
        theme: "Smart Education",
    },
    {
        sNo: 134,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25141",
        theme: "Toys & Games",
    },
    {
        sNo: 135,
        organization: "AICTE",
        title: "Student Innovation",
        category: "Software",
        psNumber: "SIH25142",
        theme: "Space Technology",
    },
];

let registrationsStore: { [psNumber: string]: FormValues[] } = {};

const dataDir = path.join(process.cwd(), 'data');
const csvFilePath = path.join(dataDir, 'registrations.csv');

async function ensureDataDirExists() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

function escapeCsvCell(cell: any) {
  let cellStr = ('' + cell).trim();
  if (/[",\n\r]/.test(cellStr)) {
    cellStr = `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

function convertToCsvRow(data: FormValues) {
  const row: any[] = [
    escapeCsvCell(data.teamName),
    escapeCsvCell(data.problemStatement),
  ];
  data.members.forEach((member: any) => {
    row.push(escapeCsvCell(member.name));
    row.push(escapeCsvCell(member.department));
    row.push(escapeCsvCell(member.year));
    row.push(escapeCsvCell(member.gender));
  });
  // Pad with empty cells if there are fewer than 6 members
  for (let i = data.members.length; i < 6; i++) {
    row.push(...Array(4).fill(''));
  }
  return row.join(',');
}

const csvHeaders = [
    'Team Name',
    'Problem Statement',
    'Member 1 Name', 'Member 1 Dept', 'Member 1 Year', 'Member 1 Gender',
    'Member 2 Name', 'Member 2 Dept', 'Member 2 Year', 'Member 2 Gender',
    'Member 3 Name', 'Member 3 Dept', 'Member 3 Year', 'Member 3 Gender',
    'Member 4 Name', 'Member 4 Dept', 'Member 4 Year', 'Member 4 Gender',
    'Member 5 Name', 'Member 5 Dept', 'Member 5 Year', 'Member 5 Gender',
    'Member 6 Name', 'Member 6 Dept', 'Member 6 Year', 'Member 6 Gender',
].join(',');


// Let's ensure this is treated as a singleton on the server.
if (process.env.NODE_ENV !== 'production') {
  if (!(global as any).problemStatementsStore) {
    (global as any).problemStatementsStore = problemStatementsStore;
    (global as any).registrationsStore = registrationsStore;
  }
  problemStatementsStore = (global as any).problemStatementsStore;
  registrationsStore = (global as any).registrationsStore;
}


export async function getProblemStatements() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  const statementsWithCounts = problemStatementsStore.map(ps => ({
    ...ps,
    submittedIdeas: registrationsStore[ps.psNumber]?.length || 0,
  }));
  return statementsWithCounts;
}

export async function getProblemStatementByPsNumber(psNumber: string) {
    // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 200));
  const statement = problemStatementsStore.find(ps => ps.psNumber === psNumber) || null;
  if (statement) {
    return {
      ...statement,
      submittedIdeas: registrationsStore[psNumber]?.length || 0,
    }
  }
  return null;
}

export async function getRegistrations() {
  return Object.values(registrationsStore).flat();
}

export async function registerTeamAction(data: FormValues) {
  try {
    const validatedData = formSchema.parse(data);
    
    // Store the registration in-memory
    const psNumber = validatedData.problemStatement;
    if (!registrationsStore[psNumber]) {
      registrationsStore[psNumber] = [];
    }
    registrationsStore[psNumber].push(validatedData);

    // Persist to CSV file
    await ensureDataDirExists();
    let fileExists = false;
    try {
        await fs.access(csvFilePath);
        fileExists = true;
    } catch (e) {
        // File does not exist
    }

    let csvContent = '';
    if (!fileExists) {
        csvContent += csvHeaders + '\n';
    }
    csvContent += convertToCsvRow(validatedData) + '\n';
    await fs.appendFile(csvFilePath, csvContent, 'utf-8');
    
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Create a more detailed error message
      const errorMessages = error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function clearRegistrations() {
  registrationsStore = {};
  
  // Clear the CSV file
  await ensureDataDirExists();
  try {
      await fs.writeFile(csvFilePath, csvHeaders + '\n', 'utf-8');
  } catch (error) {
      console.error('Failed to clear registrations.csv', error);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
