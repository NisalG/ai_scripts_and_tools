import React, { useState } from 'react';

const ContentGenerator = () => {
  const [value, setValue] = useState('');
  const [generatedContent, setGeneratedContent] = useState(''); //Stores the HTML content generated by the OpenAI API

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // OpenAI API key from .env file

  const generateContent = async (value) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a tailwind code assistant",
            },
            {
              role: "user",
              content: `create content about ${value} in tailwind section i want heading and description below that heading and then create 3 cards with place holder images and put data-gjs-type=image in every img tag and sub headings and description. give me the code only no explanation`,
            },
          ],
        }),
      });

      const data = await response.json();
      let template = data.choices[0].message.content;

      // Extract the code section from the template
      const regex = /```html\n([\s\S]*?)```/;
      const match = template.match(regex);
      const codeSection = match ? match[1] : null;

      if (codeSection) {
        setGeneratedContent(codeSection); //Updates the generatedContent state with the extracted HTML.
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerateContent = () => {
    generateContent(value); // value: Holds the input from the user
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Generator</h1>
      {/* Input field Captures the topic or value from the user.  */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a topic"
        className="border border-gray-300 p-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleGenerateContent}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Generate Content
      </button>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Generated Content</h2>
        <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
      </div>
    </div>
  );
};

export default ContentGenerator;
