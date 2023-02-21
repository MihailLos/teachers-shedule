import "./bootstrap.css";
import React, { Fragment, useState, useEffect } from "react";

function App() {
  return (
    <Fragment>
      <SemesterDropDown />
    </Fragment>
  );
}

function SemesterDropDown() {
  let [semesterList, setList] = useState([]);

  let [chosenSemester, setChosenSemester] = useState(null);

  const [showTeachers, setShowTeachers] = useState(false);

  const onChangeDropdown = (event) => {
    event.target.value ? setShowTeachers(true) : setShowTeachers(false);
    setChosenSemester(event.target.value);
  };

  useEffect(() => {
    fetch("https://api-next.kemsu.ru/api/schedule/integration/semesterList")
      .then((res) => res.json())
      .then((res) => {
        setList(res.result);
      });
  });

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        class="form-select"
        aria-label="Default select example"
      >
        <option value={""} selected>
          Выберите семестр
        </option>
        {semesterList.map((semester) => {
          return <option value={semester.Id}>{semester.Title}</option>;
        })}
      </select>
      {showTeachers ? <TeacherDropDown semId={chosenSemester} /> : null}
    </div>
  );
}

function TeacherDropDown(props) {
  let [teachersList, setList] = useState([]);

  let [chosenTeacher, setChosenTeacher] = useState(null);

  const [showTable, setShowTable] = useState(false);

  const onChangeDropdown = (event) => {
    event.target.value ? setShowTable(true) : setShowTable(false);
    setChosenTeacher(event.target.value);
  };

  useEffect(() => {
    fetch(
      `https://api-next.kemsu.ru/api/schedule/integration/teacherList?semesterId=${props.semId}`,
      {
        headers: {
          "X-Access-Token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIxNzYuMTk2LjE2LjE4MCIsInVzZXJJZCI6MTcwMzAsImlhdCI6MTY3Njk5NDMwOSwiZXhwIjoxNjc3MDgwNzA5fQ.8yzfwFql9zdeD_Hf6PiPRvaLmenwgTQiwgOmEXGi6IE",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setList(res.teacherList);
      });
  });

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        class="form-select"
        aria-label="Default select example"
      >
        <option value={""} selected>
          Выберите преподавателя
        </option>
        {teachersList.map((teacher) => {
          return <option value={teacher.fio}>{teacher.fio}</option>;
        })}
      </select>
      {showTable ? <SheduleTable teacherFio={chosenTeacher} /> : null}
    </div>
  );
}

function SheduleTable(props) {
  let [weekDayList, setWeekDayList] = useState([]);

  let [coupleList, setCoupleList] = useState([]);

  let weekTypeList = [{ name: "Чет" }, { name: "Нечет" }];

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
  });

  return (
    <div>
      <h1>{props.teacherFio}</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Дни недели</th>
            <th>Неделя</th>
            {coupleList.map((couple) => {
              return <th>{couple.Description}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {weekDayList.map((weekDay) => {
            return weekTypeList.map((weekType, idx) => {
              return (
                <tr>
                  {idx % 2 == 0 ? <td rowSpan={2}>{weekDay.DayName}</td> : null}
                  <td>{weekType.name}</td>
                  {coupleList.map((couple) => {
                    return (
                      <td>
                        <label>
                          <input
                            type={"checkbox"}
                            className="form-check-input"
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
