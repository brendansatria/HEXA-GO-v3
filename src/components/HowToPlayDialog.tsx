import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const HowToPlayDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HelpCircle className="h-4 w-4 mr-2" />
          How to Play
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play Hexa Go!</DialogTitle>
          <DialogDescription>
            A game of connections and strategy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Objective</h3>
            <p>The goal is to score the most points by placing tiles on the board and matching their tags with adjacent tiles.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Scoring Points</h3>
            <p>You get <strong>2 points</strong> for each adjacent tile that shares at least one tag with the tile you just placed. A single tile can score points from multiple neighbors at once.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Game End</h3>
            <p>The game ends when the last tile from the reserve deck has been placed on the board. The team with the highest score at the end of the game wins!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayDialog;