import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllActivities } from "../../services/activitiesService";

type Sticker = {
  title: string;
  url: string;
};

type User = {
  name: string;
  stickers: Sticker[];
};

export const Board = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllActivities()
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
        // clearToken();
        // navigate("/login");
      });
  }, []);

  // Add Component Logic Here
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {users.map((user) => (
          <UserColumn {...user} />
        ))}
      </div>
      <button onClick={() => navigate("/upload")}>Upload</button>
    </>
  );
};

type UserColumnProps = {
  name: string;
  stickers: { title: string; url: string }[];
};

export const UserColumn = (props: UserColumnProps) => {
  // Add Component Logic Here
  const ROTATION = 45;
  const MARGIN = 10;
  const SIZE = 40;
  return (
    <div
      style={{
        height: "200px",
        border: "1px solid white",
        flex: 1,
        padding: "10px",
      }}
    >
      <h3>{props.name}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", minWidth: "40vw" }}>
        {props.stickers.map(({ url }) => (
          <div
            style={{ marginTop: `${Math.random() * MARGIN - MARGIN / 2}px` }}
            key={`face-sticker-${url}`}
          >
            <img
              style={{
                width: `${SIZE}px`,
                transform: `rotate(${
                  Math.random() * ROTATION - ROTATION / 2
                }deg)`,
              }}
              src={"/api/images/" + url}
            ></img>
          </div>
        ))}
      </div>
    </div>
  );
};
