import React from "react";
import "./style.scss";
import { getDate } from "../../utils/common";

const EmailBox = ({
  emails,
  savedFav,
  handleEmailBody,
  activeEmailContent,
  listOfReadEmail,
}) => {
  console.log(listOfReadEmail);
  const activeEmail = emails?.id === activeEmailContent?.id;
  const avatarLetter = emails?.from_name?.charAt(0).toUpperCase();
  let isFavourite = savedFav?.includes(emails?.id);
  let isEmailRead = listOfReadEmail?.includes(emails?.id);
  return (
    <div
      className={`${activeEmail ? "active_box" : null} ${
        isEmailRead ? "read_bg" : null
      } email_box`}
      onClick={() => handleEmailBody(emails)}
    >
      <div className="avatar">
        <span>{avatarLetter}</span>
      </div>
      <div className="content">
        <p>
          From:
          <span className="text">{`${emails?.from_name} <${emails?.from_email}>`}</span>{" "}
        </p>
        <p className="title">
          Subject: <span className="text">{emails?.subject}</span>
        </p>
        <p>{emails?.short_description}</p>
        <span>{getDate()}</span>
        {isFavourite && <span className="favourite">Favourite</span>}
      </div>
    </div>
  );
};

export default React.memo(EmailBox);
