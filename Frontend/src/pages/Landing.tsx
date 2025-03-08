import LeaderboardTable from '../components/landing/LeaderboardTable';
import '../App.css';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Brain, Code2, Crown, Swords } from "lucide-react";
import { Link } from "react-router";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Swords className="h-12 w-12 text-primary animate-pulse" />
                <h1 className="text-4xl font-bold">Click or Regret</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Click or Regret
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
                  <div className='flex gap-2 justify-center'>
                    <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                        <Link to="/leet-code/easy">
                            Easy
                        </Link>
                    </Button>
                    <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                        <Link to="/leet-code/medium">
                            Medium
                        </Link>
                    </Button>
                    <Button size="lg" className="bg-blue-400 hover:bg-blue-700">
                        <Link to="/leet-code/hard">
                            Hard
                        </Link>
                    </Button>
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
                     <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                        <Link to="/behavior/hard">
                            Hard
                        </Link>
                    </Button>
                    <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                        <Link to="/behavior/medium">
                            Medium
                        </Link>
                    </Button>
                    <Button size="lg" className="bg-purple-500 hover:bg-purple-700">
                        <Link to="/behavior/hard">
                            Hard
                        </Link>
                    </Button>
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
                      data={[
                        { rank: 1, name: "Alex Chen", score: 2500, solved: 15 },
                        { rank: 2, name: "Sarah Kim", score: 2350, solved: 14 },
                        { rank: 3, name: "Mike Johnson", score: 2200, solved: 13 },
                      ]}
                    />
                  </TabsContent>
                  <TabsContent value="behavior">
                    <LeaderboardTable
                      data={[
                        { rank: 1, name: "Emma Davis", score: 1800, solved: 12 },
                        { rank: 2, name: "James Wilson", score: 1650, solved: 11 },
                        { rank: 3, name: "Lisa Brown", score: 1500, solved: 10 },
                      ]}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
    )
}

export default Landing
