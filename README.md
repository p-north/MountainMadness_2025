# Click AND Regret 🚀

Click AND Regret is an interactive Minesweeper-style game where users predict the game mode (easy, medium, hard) and navigate through tiles. The objective is to land on green tiles while avoiding red tiles. If a user lands on a red tile, they must answer either a behavioral or LeetCode question, with the added twist of random jump scares!

## Tech Stack

### Frontend:
- React
- React Router
- Tailwind CSS
- ShadCN

### Backend:
- Python
- FastAPI
- MySQL
- AWS S3
- Perplexity AI
- Eleven Labs AI

## Features
- **Game Mode Selection**: Users can choose between easy, medium, or hard difficulty.
- **Tile-Based Gameplay**: Green tiles are safe, while red tiles lead to challenges.
- **Question Challenges**: Players must answer a behavioral or LeetCode question upon landing on a red tile.
- **Jump Scares**: Random jump scares add an element of surprise and tension.
- **AI Integration**: Uses Perplexity AI and Eleven Labs AI for an enhanced gameplay experience.
- **Cloud Storage**: AWS S3 is used for storing assets and game-related data.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/click-or-regret.git
   ```
2. Navigate into the project directory:
   ```sh
   cd click-or-regret
   ```
3. Install frontend dependencies:
   ```sh
   cd frontend
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```
5. Install backend dependencies:
   ```sh
   cd ../backend
   pip install -r requirements.txt
   ```
6. Start the backend:
   ```sh
   uvicorn main:app --reload
   ```

## Usage
1. Open the game in your browser.
2. Select a game mode (easy, medium, hard).
3. Click on tiles to reveal their outcome.
4. Avoid red tiles or answer the presented questions.
5. Brace yourself for potential jump scares!

## Contributing
Feel free to submit pull requests or open issues to improve the game.


## Contact
For any inquiries or feedback, reach out to founding devs.
