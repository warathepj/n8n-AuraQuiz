// claude
// n8n Code Node - JavaScript
// This code extracts and parses the quiz content from the AI agent output

for (const item of $input.all()) {
  // Get the output string from the AI agent
  const outputString = item.json.output;
  
  // Parse the markdown content dynamically
  const lines = outputString.split('\n');
  const questions = [];
  let currentQuestion = {};
  let title = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Extract title from "## Quiz on: [TITLE]" format
    if (line.startsWith('## Quiz on:')) {
      title = line.replace('## Quiz on:', '').trim();
    }
    
    // Detect question start
    if (line.startsWith('**Question')) {
      if (Object.keys(currentQuestion).length > 0) {
        questions.push(currentQuestion);
      }
      
      // Extract question number and text
      const questionMatch = line.match(/\*\*Question (\d+):\*\* (.+)/);
      currentQuestion = {
        questionNumber: questionMatch ? parseInt(questionMatch[1]) : questions.length + 1,
        questionText: questionMatch ? questionMatch[2] : line.replace(/\*\*/g, ''),
        options: [],
        correctAnswer: '',
        explanation: ''
      };
    }
    // Detect options (A), B), C), D))
    else if (line.match(/^[A-D]\)/)) {
      currentQuestion.options.push(line);
    }
    // Detect correct answer
    else if (line.startsWith('**Correct Answer:**')) {
      currentQuestion.correctAnswer = line.replace('**Correct Answer:** ', '');
    }
    // Detect explanation
    else if (line.startsWith('**Explanation:**')) {
      currentQuestion.explanation = line.replace('**Explanation:** ', '');
    }
  }
  
  // Add the last question
  if (Object.keys(currentQuestion).length > 0) {
    questions.push(currentQuestion);
  }
  
  // Return structured data
  return {
    json: {
      title: title || 'Quiz', // Dynamic title extraction
      totalQuestions: questions.length,
      questions: questions,
    //   rawOutput: outputString // Keep original for reference
    }
  };
}