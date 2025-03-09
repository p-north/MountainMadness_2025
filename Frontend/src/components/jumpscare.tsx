interface JumpscareProps {
  trigger: boolean;
  image: string | null;
}

const Jumpscare = ({ trigger, image }: JumpscareProps) => {
  if (!trigger || !image) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-100">
      <img src={image} alt="Jumpscare" className="w-96 h-auto animate-pulse" />
    </div>
  );
};

export default Jumpscare;
