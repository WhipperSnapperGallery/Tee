## Basic instructions for use:

1. Download the files to your local device or clone the repository.
2. Navigate to the project's root directory and get dependencies by running ```npm install```
3. In the root directory, create a .env file
4. In the .env file, create an environment variable OPENAI_API_KEY and copy+paste your OpenAI API key to this variable
5. In the root directory, create a folder called .webpack.
6. Inside the .webpack folder, create a file called webpack.config.js
7. Copy and paste the following into the new file.

```javascript
const webpack = require('webpack');

module.exports = {
    entry: '/src/scripts/chat.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
    },
};
```

8. Run the command ```npm run bundle```. If no errors occur, everything was done correctly and the website should be able to load properly.
9. In the public folder, open index.html to run the website.
