import { Brain, Code2, Crown, Swords } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import '../App.css';
import LeaderboardTable from '../components/landing/LeaderboardTable';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Landing = () => {
    const leaderboard = useLoaderData();

  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Swords className="h-12 w-12 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold">Click and Regret</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Click AND Regret is an interactive Minesweeper-style game where users predict
          the game mode and navigate through tiles.
        </p>
      </div>

      {/* Game Modes */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-card/5 backdrop-blur border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-white">
              <Code2 className="h-6 w-6 text-blue-400" />
              LeetCode Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">
              Solve algorithmic puzzles while clicking tiles.
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/leet-code/easy">
                <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                  Easy
                </Button>
              </Link>
              <Link to="/leet-code/medium">
                <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                  Medium
                </Button>
              </Link>
              <Link to="/leet-code/hard">
                <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                  Hard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/5 backdrop-blur border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-white">
              <Brain className="h-6 w-6 text-purple-400 hover:bg-purple-700" />
              Behavior Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">
              Test your behavioral interview skills
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/behavior/easy">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                  Easy
                </Button>
              </Link>
              <Link to="/behavior/medium">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                  Medium
                </Button>
              </Link>
              <Link to="/behavior/hard">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                  Hard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <Card className="bg-card/5 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-6 w-6 text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="leetcode" className="w-full">
            <TabsList className="bg-card-foreground flex w-full gap-2">
              <TabsTrigger value="leetcode">LeetCode Mode</TabsTrigger>
              <TabsTrigger value="behavior">Behavior Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="leetcode">
              <LeaderboardTable
                data={leaderboard.leetcode}
              />
            </TabsContent>
            <TabsContent value="behavior">
              <LeaderboardTable
                data={leaderboard.behavior}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;

export const loader = async () => {
    console.log(import.meta.env.VITE_SERVER_URL);
  const leetcodeRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/leaderboard/leetcode`);
  const leetcodeData = await leetcodeRes.json();

  const behaviourRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/leaderboard/behaviour`);
  const behaviourData = await behaviourRes.json();
  
  return {
    leetcode: leetcodeData.map((item: any, idx: number) => ({...item, rank: idx + 1})),
    behavior: behaviourData.map((item: any, idx: number) => ({...item, rank: idx + 1}))
  };
}
