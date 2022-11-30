import React from "react";
import { useEffect, useState } from "react";
// local import
import "./style.scss";
import ApiService from "service/apiService";
import EmailBox from "components/EmailBox";
import { getDate } from "../../utils/common";

const Email = () => {
  const [emailList, setEmailList] = useState(undefined);
  const [filterEmailList, setFilterEmailList] = useState(undefined);
  const [emailBody, setEmailBody] = useState(undefined);
  const [activeEmailContent, setActiveEmailContent] = useState(undefined);
  const [savedFav, setSaveFav] = useState(undefined);
  const [filterType, setFilterType] = useState("");
  const [listOfReadEmail, setListOfReadEmail] = useState([]);

  useEffect(() => {
    ApiService.getEmailList()
      .then((res) => {
        setEmailList(res);
        setFilterEmailList(res);
      })
      .catch((err) => {
        console.log(err);
      });
    let fav = JSON.parse(localStorage.getItem("favorits"));
    setSaveFav(fav);
    setListOfReadEmail(fav);
  }, []);

  const handleEmailBody = (emails) => {
    if (emails?.id === activeEmailContent?.id) {
      setActiveEmailContent(undefined);
      setEmailBody(undefined);
    } else {
      setActiveEmailContent(emails);
      setListOfReadEmail((prev) => [...prev, emails?.id]);
      ApiService.getEmailBody(emails?.id)
        .then((res) => {
          setEmailBody(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFavourite = () => {
    let favEmailId = activeEmailContent?.id;
    let favorits = JSON.parse(localStorage.getItem("favorits"));
    if (favorits) {
      if (favorits.includes(favEmailId)) {
        favorits = favorits.filter((id) => id !== favEmailId);
        setSaveFav(favorits);
      } else {
        favorits = [...favorits, favEmailId];
        setSaveFav(favorits);
      }
    } else {
      favorits = [activeEmailContent?.id];
      setSaveFav(favorits);
    }
    localStorage.setItem("favorits", JSON.stringify(favorits));
  };

  const handleFilter = (filterType) => {
    setFilterType(filterType);
    let favorits = JSON.parse(localStorage.getItem("favorits"));
    if (filterType === "fav") {
      if (filterEmailList) {
        setFilterEmailList(
          emailList.filter((item) => {
            return favorits.includes(item?.id);
          })
        );
      }
    } else if (filterType === "read") {
      setFilterEmailList(
        emailList.filter((item) => {
          return (
            listOfReadEmail.includes(item?.id) || favorits.includes(item?.id)
          );
        })
      );
    } else if (filterType === "unread") {
      setFilterEmailList(
        emailList.filter((item) => {
          return (
            !listOfReadEmail.includes(item?.id) && !favorits.includes(item?.id)
          );
        })
      );
    } else if (filterType === "all") {
      setFilterEmailList(emailList);
    }
  };

  return (
    <section className="email">
      <div className="nav">
        <span>Filter By: </span>
        <span
          className={`${filterType === "unread" ? "nav--active" : " "}`}
          onClick={() => handleFilter("unread")}
        >
          Unread
        </span>
        <span
          className={`${filterType === "read" ? "nav--active" : " "}`}
          onClick={() => handleFilter("read")}
        >
          Read{" "}
        </span>
        <span
          className={`${filterType === "fav" ? "nav--active" : " "}`}
          onClick={() => handleFilter("fav")}
        >
          Favorits
        </span>
        <span
          className={`${filterType === "all" ? "nav--active" : " "}`}
          onClick={() => handleFilter("all")}
        >
          All
        </span>
      </div>
      {emailList && (
        <div className="email_view">
          <div className={emailBody ? "split_screen_left" : "full_screen"}>
            {filterEmailList.map((emails, id) => (
              <EmailBox
                emails={emails}
                key={id}
                handleEmailBody={handleEmailBody}
                activeEmailContent={activeEmailContent}
                savedFav={savedFav}
                listOfReadEmail={listOfReadEmail}
              />
            ))}
          </div>
          {emailBody && (
            <div className="split_screen_right">
              <div className="avatar">
                <span>
                  {activeEmailContent?.from_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="main_body_content">
                <h2 className="subject">{activeEmailContent?.subject}</h2>
                <p className="datetime">{getDate()}</p>
                <button onClick={handleFavourite}>Mark as Favorits</button>
                <div
                  dangerouslySetInnerHTML={{ __html: emailBody?.body }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Email;
