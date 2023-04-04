import "./bootstrap.css";
import React, { useState, useEffect } from "react";

function App() {
  return <SemesterDropDown />;
}

let accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiI4Mi4xNzkuMS45IiwidXNlcklkIjoxNzAzMCwiaWF0IjoxNjgwNTkwMzMyLCJleHAiOjE2ODA2NzY3MzJ9.ibU_agWDxcl8vWxKNY5jZdsG1rk3S7IqBuKoytWRRq0";

function SemesterDropDown() {
  let [semesterList, setList] = useState([]);

  let [loading, setLoading] = useState(true);

  let [chosenSemester, setChosenSemester] = useState("");

  const onChangeDropdown = (event) => {
    setChosenSemester(
      semesterList.find((element) => element.Id === Number(event.target.value))
    );
  };

  useEffect(() => {
    fetch("https://api-next.kemsu.ru/api/schedule/integration/semesterList")
      .then((res) => res.json())
      .then((res) => {
        setList(res.result);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        className="form-select"
        aria-label="Default select example"
        value={chosenSemester ? chosenSemester.Id : ""}
      >
        <option value="">Выберите семестр</option>
        {semesterList.map((semester) => {
          return (
            <option key={semester.Id} value={semester.Id}>
              {semester.Title}
            </option>
          );
        })}
      </select>
      {chosenSemester && (
        <TeacherDropDown
          chosenSemester={chosenSemester}
          key={chosenSemester.Id}
        />
      )}
    </div>
  );
}

function TeacherDropDown(props) {
  let [teachersList, setList] = useState([]);

  let [chosenTeacher, setChosenTeacher] = useState("");

  const [showTable, setShowTable] = useState(false);

  let [loading, setLoading] = useState(true);

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
        setLoading(false);
      });
  }, [props.chosenSemester]);

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <select
        onChange={onChangeDropdown}
        className="form-select"
        aria-label="Default select example"
        defaultValue={chosenTeacher}
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
  let [weekDayList, setWeekDayList] = useState([]);

  let [coupleList, setCoupleList] = useState([]);

  let weekTypesList = [
    { name: "Не выбрано", num: null },
    { name: "Каждую", num: 1 },
    { name: "Чет", num: 2 },
    { name: "Нечет", num: 3 },
  ];

  let [fetchedWeekTypeList, setFetchedWeekTypeList] = useState([]);

  let [loading, setLoading] = useState(true);

  function updateFlags(coupleId, weekDayId, periodTypeId) {
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
          periodTypeId: +periodTypeId,
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

  useEffect(() => {
    fetch(
      `https://api-next.kemsu.ru/api/schedule/integration/prepRestriction?prepId=${props.chosenTeacher.prepId}&semesterId=${props.chosenSemester.Id}`,
      {
        method: "GET",
        headers: {
          "X-Access-Token": accessToken,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setFetchedWeekTypeList(res.result);
        setLoading(false);
      });
  }, [props.chosenTeacher.prepId]);

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{props.chosenTeacher.fio}</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Дни недели</th>
            {coupleList.map((couple) => {
              return <th key={couple.Id}>{couple.Description}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {weekDayList.map((weekDay, idx) => {
            return (
              <tr key={Math.random()}>
                <td>{weekDay.DayName}</td>
                {coupleList.map((couple, idx2) => {
                  var item = fetchedWeekTypeList[idx][idx2];
                  var result = weekTypesList.find((obj) => {
                    return obj.num == item;
                  });
                  return (
                    <td>
                      <select
                        value={result.num}
                        key={Math.random()}
                        onChange={(event) => {
                          updateFlags(
                            couple.Id,
                            weekDay.Id,
                            event.target.value
                          );
                        }}
                        className="form-select"
                        aria-label="Default select example"
                      >
                        {weekTypesList.map((weekType) => {
                          return (
                            <option key={Math.random()} value={weekType.num}>
                              {weekType.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
