import { FC } from "react";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodIndicatorProps {
  sentiment: number;
}

export const MoodIndicator: FC<MoodIndicatorProps> = ({ sentiment }) => {
  let Icon = Meh;
  let color = "text-yellow-500";

  if (sentiment > 0.3) {
    Icon = Smile;
    color = "text-green-500";
  } else if (sentiment < -0.3) {
    Icon = Frown;
    color = "text-red-500";
  }

  return <Icon className={`w-6 h-6 ${color}`} />;
};
