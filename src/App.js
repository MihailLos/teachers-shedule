import "./bootstrap.css";
import React, { useState, useEffect } from "react";

function App() {
  return <SemesterDropDown />;
}

function SemesterDropDown() {
  let [semesterList, setList] = useState([]);

  let [chosenSemester, setChosenSemester] = useState(null);

  const [showTeachers, setShowTeachers] = useState(false);

  const onChangeDropdown = (event) => {
    event.target.value ? setShowTeachers(true) : setShowTeachers(false);
    setChosenSemester(
      semesterList.find((element) => element.Id === Number(event.target.value))
    );
  };

  useEffect(() => {
    fetch("https://api-next.kemsu.ru/api/schedule/integration/semesterList")
      .then((res) => res.json())
      .then((res) => {
        setList(res.result);
      });
  }, []);

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        className="form-select"
        aria-label="Default select example"
      >
        <option value={""}>Выберите семестр</option>
        {semesterList.map((semester) => {
          return (
            <option key={semester.Id} value={semester.Id}>
              {semester.Title}
            </option>
          );
        })}
      </select>
      {showTeachers ? (
        <TeacherDropDown chosenSemester={chosenSemester} />
      ) : null}
    </div>
  );
}

function TeacherDropDown(props) {
  let accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIxNzYuMTk2LjE2LjE4MCIsInVzZXJJZCI6MTcwMzAsImlhdCI6MTY3ODI4ODAxMywiZXhwIjoxNjc4Mzc0NDEzfQ.YxQXiCSA-BBdhIjErwjIlvM3H5VOBBdZj6VU1y9Yz6A";
  let [teachersList, setList] = useState([]);

  let [chosenTeacher, setChosenTeacher] = useState(null);

  const [showTable, setShowTable] = useState(false);

  const onChangeDropdown = (event) => {
    event.target.value ? setShowTable(true) : setShowTable(false);
    setChosenTeacher(
      teachersList.find(
        (element) => element.prepId === Number(event.target.value)
      )
    );
  };

  useEffect(() => {
    fetch(
      `https://api-next.kemsu.ru/api/schedule/integration/teacherList?semesterId=${props.chosenSemester.Id}`,
      {
        headers: {
          "X-Access-Token": accessToken,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setList(res.teacherList);
      });
  }, [props.semId]);

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        className="form-select"
        aria-label="Default select example"
      >
        <option value={""}>Выберите преподавателя</option>
        {teachersList.map((teacher) => {
          return (
            <option key={teacher.prepId} value={teacher.prepId}>
              {teacher.fio}
            </option>
          );
        })}
      </select>
      {showTable ? (
        <SheduleTable
          chosenTeacher={chosenTeacher}
          chosenSemester={props.chosenSemester}
        />
      ) : null}
    </div>
  );
}

function SheduleTable(props) {
  let accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIxNzYuMTk2LjE2LjE4MCIsInVzZXJJZCI6MTcwMzAsImlhdCI6MTY3ODI4ODAxMywiZXhwIjoxNjc4Mzc0NDEzfQ.YxQXiCSA-BBdhIjErwjIlvM3H5VOBBdZj6VU1y9Yz6A";

  let [weekDayList, setWeekDayList] = useState([]);

  let [coupleList, setCoupleList] = useState([]);

  let weekTypeList = [{ name: "Чет" }, { name: "Нечет" }];

  function updateFlags(coupleId, weekDayId, restrictionFlag) {
    fetch(
      "https://api-next.kemsu.ru/api/schedule/integration/updatePrepRestriction",
      {
        method: "POST",
        headers: {
          "X-Access-Token": accessToken,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          prepId: props.chosenTeacher.prepId,
          semesterId: props.chosenSemester.Id,
          coupleId: coupleId,
          weekDayId: weekDayId,
          restrictionFlag: +restrictionFlag,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => console.log(JSON.stringify(response)));
  }

  useEffect(() => {
    fetch("https://api-next.kemsu.ru/api/schedule/integration/weekDayList")
      .then((res) => res.json())
      .then((res) => {
        setWeekDayList(res.weekDayList);
      });
    fetch("https://api-next.kemsu.ru/api/schedule/integration/coupleList")
      .then((res) => res.json())
      .then((res) => {
        setCoupleList(res.coupleList);
      });
  }, []);

  return (
    <div>
      <h1>{props.chosenTeacher.fio}</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Дни недели</th>
            <th>Неделя</th>
            {coupleList.map((couple) => {
              return <th key={couple.Id}>{couple.Description}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {weekDayList.map((weekDay) => {
            return weekTypeList.map((weekType, idx) => {
              return (
                <tr>
                  {idx % 2 === 0 ? (
                    <td rowSpan={2} key={weekDay.Id}>
                      {weekDay.DayName}
                    </td>
                  ) : null}
                  <td>{weekType.name}</td>
                  {coupleList.map((couple) => {
                    return (
                      <td>
                        <label>
                          <input
                            type={"checkbox"}
                            className="form-check-input"
                            key={Math.random()}
                            onChange={(event) => {
                              updateFlags(
                                couple.Id,
                                weekDay.Id,
                                Boolean(event.target.value)
                              );
                            }}
                          />
                          &nbsp; Не выставлять
                        </label>
                      </td>
                    );
                  })}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
