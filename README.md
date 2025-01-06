# AI-Powered Text Summarizer

A modern web application that uses AI to generate concise summaries of text content. Built with vanilla JavaScript and powered by the Hugging Face API.


## Features

### Core Functionality
- Text summarization using the BART-large-CNN model
- Support for both direct text input and file upload
- Handles text files (.txt) with drag-and-drop functionality
- Character count and input validation
- Copy-to-clipboard functionality for summaries

### User Interface
- Clean, modern, and responsive design
- Dark/Light mode toggle with system preference detection
- Tabbed interface for text input and file upload
- Interactive drag-and-drop file upload zone
- Loading states and error handling
- Character counter with real-time updates

### Technical Features
- No framework dependencies - built with vanilla JavaScript
- Responsive design that works on all screen sizes
- Theme preference persistence using localStorage
- File size formatting and validation
- Error handling for API requests and file uploads

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- An internet connection
- A Hugging Face API key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/text-summarizer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd text-summarizer
   ```

3. Replace the API key in `index.js` with your own Hugging Face API key:
   ```javascript
   'Authorization': 'Bearer YOUR_API_KEY_HERE'
   ```

4. Open `index.html` in your web browser or serve it using a local server.

### Usage
1. **Text Input**:
   - Type or paste your text directly into the text area
   - Click "Summarize" to generate a summary
   - Use "Clear" to reset the input and output

2. **File Upload**:
   - Click the "File Upload" tab
   - Drag and drop a text file or click to browse
   - Supported file type: .txt
   - File information will be displayed below the upload area

3. **Theme Toggle**:
   - Click the sun/moon icon in the top-right corner to switch between light and dark modes
   - Your preference will be saved for future visits

## Technical Details

### API Integration
The application uses the Hugging Face API with the facebook/bart-large-cnn model for text summarization. The API endpoint is:
```
https://api-inference.huggingface.co/models/facebook/bart-large-cnn
```

### File Handling
- Supports text files (.txt) with real-time preview
- Validates file types and provides user feedback
- Displays file size in human-readable format

### Theme Management
- Automatically detects system color scheme preference
- Persists user theme preference in localStorage
- Smooth transitions between themes

## Future Improvements
- [ ] Add support for DOC, DOCX, and PDF files
- [ ] Implement secure API key management
- [ ] Add different summarization options (length, style)
- [ ] Add save/export functionality for summaries
- [ ] Implement rate limiting and error retry logic

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Hugging Face](https://huggingface.co/) for providing the AI model API
- [BART](https://arxiv.org/abs/1910.13461) research paper and team
- Louis Kapend - Project Developer

## Contact
Louis Kapend - louiskapend2016@gmail.com

