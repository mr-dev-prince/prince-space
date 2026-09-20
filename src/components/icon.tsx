import {
  FaBookOpen,
  FaCompass,
  FaLandmark,
  FaLeaf,
  FaMicrochip,
  FaMobileAlt,
  FaNetworkWired,
  FaWallet,
} from "react-icons/fa";
import { IconKey } from "../interfaces/components";

const icons: Record<IconKey, React.ReactNode> = {
  compass: <FaCompass size={18} />,
  wallet: <FaWallet size={18} />,
  chip: <FaMicrochip size={18} />,
  book: <FaBookOpen size={18} />,
  mobile: <FaMobileAlt size={18} />,
  landmark: <FaLandmark size={18} />,
  leaf: <FaLeaf size={18} />,
  network: <FaNetworkWired size={18} />,
};

const Icon = ({ name }: { name: IconKey }) => (
  <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center border border-ink/10 text-ink/70">
    {icons[name]}
  </div>
);

export default Icon;
