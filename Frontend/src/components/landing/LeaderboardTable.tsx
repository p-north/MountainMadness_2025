interface LeaderboardProps {
    rank: number;
    name: string;
    score: number;
  }

const LeaderboardTable = ({ data }: { data: LeaderboardProps[] }) => {
    return (
      <div className="relative overflow-x-auto text-muted-foreground">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-primary/10">
            <tr>
              <th scope="col" className="px-6 py-3">Rank</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.rank} className="border-b border-primary/10">
                <td className="px-6 py-4">{entry.rank}</td>
                <td className="px-6 py-4">{entry.name}</td>
                <td className="px-6 py-4">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default LeaderboardTable;