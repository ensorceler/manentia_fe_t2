interface Props {
  children: React.ReactNode;
}

const AlertModal = ({ children }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80">
      <div className="max-w-xs ml-auto mr-auto mt-40 p-4 flex justify-center items-center z-10 bg-white rounded-xl ">
        {children}
      </div>
    </div>
  );
};
export default AlertModal;
