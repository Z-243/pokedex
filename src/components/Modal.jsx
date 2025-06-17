import ReactDom from "react-dom";

export default function Modal(props) {
  const { children, handleCloseModal } = props;
  // render out info in the new div with id='portal & not with id='root'; createPortal() takes 2 arguments
  return ReactDom.createPortal(
    <div className="modal-container">
      {/* underlay to close the modal */}
      <button onClick={handleCloseModal} className="modal-underlay" />
      <div className="modal-content">
        {/* children b/w the opening & closing tab */}
        {children}
      </div>
    </div>,
    document.getElementById("portal") //find the element with 'portal and inject the above content in it
  );
}
