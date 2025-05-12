// const Header = (props) => <h1>{props.course}</h1>

// const Content = (props) => (
//   <div>
//     <Part part={props.parts[0]} />
//     <Part part={props.parts[1]} />
//     <Part part={props.parts[2]} />
//   </div>
// )

// const Part = (props) => (
//   <p>
//     {props.part.name} {props.part.exercises}
//   </p>
// )

// const Total = (props) => <p>Number of exercises {props.total}</p>


const Course = ( {course }) => {
  return (
    <div>
      <h1> {course.name}</h1>
      <div>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
      </div>
      <p><strong>total of {course.parts.reduce((s, p) => s + p.exercises, 0)} exercises</strong></p>
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />

  // return (
  //   <div>
  //     <Header course={course.name} />
  //     <Content parts={course.parts} />
  //     <Total
  //       total={
  //         course.parts[0].exercises +
  //         course.parts[1].exercises +
  //         course.parts[2].exercises
  //       }
  //     />
  //   </div>
  // )
}

export default App
