import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import './ChatBot.css';

const FitnessChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Define the chatbot theme to match the website's style
  const theme = {
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    headerBgColor: '#ff4d4d',
    headerFontColor: '#fff',
    headerFontSize: '16px',
    botBubbleColor: '#ff4d4d',
    botFontColor: '#fff',
    userBubbleColor: '#333',
    userFontColor: '#fff',
  };

  // Define the chatbot steps
  const steps = [
    {
      id: 'welcome',
      message: 'Hi there! Welcome to FitFlex Gym. How can I help you today?',
      trigger: 'options',
    },
    {
      id: 'options',
      options: [
        { value: 'membership', label: 'Membership Information', trigger: 'membership' },
        { value: 'classes', label: 'Class Schedule', trigger: 'classes' },
        { value: 'trainers', label: 'Personal Trainers', trigger: 'trainers' },
        { value: 'location', label: 'Gym Locations', trigger: 'location' },
        { value: 'hours', label: 'Operating Hours', trigger: 'hours' },
        { value: 'other', label: 'Other Questions', trigger: 'other' },
      ],
    },
    {
      id: 'membership',
      message: 'We offer several membership plans starting at $29.99/month. Would you like to know more about our specific plans?',
      trigger: 'membership-options',
    },
    {
      id: 'membership-options',
      options: [
        { value: 'basic', label: 'Basic Plan', trigger: 'basic-plan' },
        { value: 'premium', label: 'Premium Plan', trigger: 'premium-plan' },
        { value: 'elite', label: 'Elite Plan', trigger: 'elite-plan' },
        { value: 'back', label: 'Back to Main Menu', trigger: 'options' },
      ],
    },
    {
      id: 'basic-plan',
      message: 'Our Basic Plan ($29.99/month) includes access to gym equipment and locker rooms. Perfect for those just starting their fitness journey!',
      trigger: 'follow-up',
    },
    {
      id: 'premium-plan',
      message: 'Our Premium Plan ($49.99/month) includes everything in Basic plus group fitness classes and one personal training session per month.',
      trigger: 'follow-up',
    },
    {
      id: 'elite-plan',
      message: 'Our Elite Plan ($99.99/month) includes everything in Premium plus unlimited personal training, nutrition consultation, and premium locker with towel service.',
      trigger: 'follow-up',
    },
    {
      id: 'classes',
      message: 'We offer a variety of classes including Yoga, HIIT, Spinning, Zumba, and more! Classes run from 6am to 8pm daily. Would you like to see the full schedule?',
      trigger: 'classes-options',
    },
    {
      id: 'classes-options',
      options: [
        { value: 'schedule', label: 'View Full Schedule', trigger: 'schedule-info' },
        { value: 'popular', label: 'Most Popular Classes', trigger: 'popular-classes' },
        { value: 'back', label: 'Back to Main Menu', trigger: 'options' },
      ],
    },
    {
      id: 'schedule-info',
      message: 'You can view our full class schedule on our Classes page. Would you like me to direct you there?',
      trigger: 'redirect-options',
    },
    {
      id: 'popular-classes',
      message: 'Our most popular classes are HIIT (Mon/Wed/Fri at 6pm), Yoga (Daily at 7am), and Spinning (Tue/Thu at 5:30pm).',
      trigger: 'follow-up',
    },
    {
      id: 'trainers',
      message: 'Our certified personal trainers can help you achieve your fitness goals! Would you like to know more about our trainers or personal training packages?',
      trigger: 'trainers-options',
    },
    {
      id: 'trainers-options',
      options: [
        { value: 'meet', label: 'Meet Our Trainers', trigger: 'meet-trainers' },
        { value: 'packages', label: 'Training Packages', trigger: 'training-packages' },
        { value: 'back', label: 'Back to Main Menu', trigger: 'options' },
      ],
    },
    {
      id: 'meet-trainers',
      message: 'You can meet our expert trainers on our Trainers page. Each trainer specializes in different areas like weight loss, muscle building, or rehabilitation.',
      trigger: 'follow-up',
    },
    {
      id: 'training-packages',
      message: 'We offer single sessions ($60), 5-session packages ($275), and 10-session packages ($500). Elite members get unlimited sessions included in their membership.',
      trigger: 'follow-up',
    },
    {
      id: 'location',
      message: 'Our main gym is located at 123 Fitness Ave, Downtown. We also have locations in Westside (456 Health Blvd) and Northside (789 Strength St).',
      trigger: 'follow-up',
    },
    {
      id: 'hours',
      message: 'We are open Monday-Friday from 5am to 11pm, and Saturday-Sunday from 7am to 9pm. Holiday hours may vary.',
      trigger: 'follow-up',
    },
    {
      id: 'other',
      message: 'What else would you like to know about?',
      trigger: 'other-options',
    },
    {
      id: 'other-options',
      options: [
        { value: 'facilities', label: 'Gym Facilities', trigger: 'facilities' },
        { value: 'amenities', label: 'Amenities', trigger: 'amenities' },
        { value: 'covid', label: 'COVID Protocols', trigger: 'covid' },
        { value: 'contact', label: 'Contact Information', trigger: 'contact' },
        { value: 'back', label: 'Back to Main Menu', trigger: 'options' },
      ],
    },
    {
      id: 'facilities',
      message: 'Our gyms feature state-of-the-art equipment, cardio zones, free weight areas, functional training spaces, and dedicated studios for classes.',
      trigger: 'follow-up',
    },
    {
      id: 'amenities',
      message: 'We offer clean locker rooms with showers, sauna, towel service (Elite members), water stations, and a smoothie bar.',
      trigger: 'follow-up',
    },
    {
      id: 'covid',
      message: 'We follow all local health guidelines. Currently, we have enhanced cleaning protocols, hand sanitizing stations, and equipment spacing for safety.',
      trigger: 'follow-up',
    },
    {
      id: 'contact',
      message: 'You can reach us at info@fitflexgym.com or call us at (555) 123-4567. Our staff is available during business hours to assist you.',
      trigger: 'follow-up',
    },
    {
      id: 'follow-up',
      message: 'Is there anything else you would like to know?',
      trigger: 'follow-up-options',
    },
    {
      id: 'follow-up-options',
      options: [
        { value: 'yes', label: 'Yes, I have more questions', trigger: 'options' },
        { value: 'no', label: 'No, that\'s all for now', trigger: 'goodbye' },
      ],
    },
    {
      id: 'redirect-options',
      options: [
        { value: 'yes', label: 'Yes, please', trigger: 'redirect' },
        { value: 'no', label: 'No, I have other questions', trigger: 'options' },
      ],
    },
    {
      id: 'redirect',
      message: 'Great! You can visit our Classes page for the full schedule. Is there anything else I can help you with?',
      trigger: 'follow-up-options',
    },
    {
      id: 'goodbye',
      message: 'Thank you for chatting with us! Feel free to visit our gym or contact us if you have any more questions. Have a great day!',
      end: true,
    },
  ];

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <ThemeProvider theme={theme}>
            <ChatBot
              steps={steps}
              headerTitle="FitFlex Gym Assistant"
              botAvatar="/images/chatbot-avatar.svg"
              userAvatar="/images/user-avatar.svg"
              floating={false}
              width="350px"
              enableMobileAutoFocus={true}
              cache={false}
            />
          </ThemeProvider>
        </div>
      )}
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comment-dots"></i>
            <span>Need Help?</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FitnessChatBot;