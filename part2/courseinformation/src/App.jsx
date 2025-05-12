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

const Course = ({ courses }) => {
  return courses.map(course => {
    const total = course.parts.reduce((s, p) => {
      console.log('this is s', s);
      console.log('this is p.exercises', p.exercises);
      return s + p.exercises;
    }, 0);

    return (
      <div key={course.id}>
        <h1>{course.name}</h1>
        <div>
          {course.parts.map(part => (
            <p key={part.id}>
              {part.name} {part.exercises}
            </p>
          ))}
        </div>
        <p>
          <strong>total of {total} exercises</strong>
        </p>
      </div>
    );
  });
};

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Course courses={courses} />

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
