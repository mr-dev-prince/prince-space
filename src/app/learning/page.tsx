import LearningDeck from "../../components/learning";

export const metadata = {
  title: "Learning · Prince Chaurasia",
  description: "What I am learning right now, in the open.",
};

/**
 * The deck fills exactly one screen, so this page never scrolls. The bottom
 * padding on phones keeps it clear of the fixed tab bar.
 */
const LearningPage = () => {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-[1600px] flex-col overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+4.75rem)] pt-4 sm:px-6 md:px-24 md:pb-5 md:pt-5">
      <LearningDeck />
    </main>
  );
};

export default LearningPage;
