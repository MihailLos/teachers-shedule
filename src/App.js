import "./bootstrap.css";

function App() {
  let weekDayList = [
    { name: "Понедельник" },
    { name: "Вторник" },
    { name: "Среда" },
    { name: "Четверг" },
    { name: "Пятница" },
    { name: "Суббота" },
  ];

  let weekTypeList = [{ name: "Чет" }, { name: "Нечет" }];

  let coupleList = [
    { name: "8.00-9.35" },
    { name: "9.45-11.20" },
    { name: "11.45-13.20" },
    { name: "13.30-15.05" },
    { name: "15.30-17.05" },
    { name: "17.15-18.50" },
    { name: "19.00-20.35" },
  ];

  return (
    <div>
      <h1>Ф.И.О. преподавателя</h1>
      <body>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Дни недели</th>
              <th>Неделя</th>
              {coupleList.map((couple) => {
                return <th>{couple.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {weekDayList.map((weekDay) => {
              return weekTypeList.map((weekType, idx) => {
                return (
                  <tr>
                    {idx % 2 == 0 ? <td rowSpan={2}>{weekDay.name}</td> : null}
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
      </body>
    </div>
  );
}

export default App;
