const Course = ({ courses }) => {
  return courses.map(course => {
    const total = course.parts.reduce((s, p) => {
      console.log('this is s', s);
      console.log('this is p.exercises', p.exercises);
      return s + p.exercises;
    }, 0);

    return (
      <div key={course.id}>
        <Header course={course} />
        <Content course={course} />
        <Total total={total} />
        {/* <div>
          {course.parts.map(part => (
            <p key={part.id}>
              {part.name} {part.exercises}
            </p>
          ))}
        </div> */}
        {/* <p>
          <strong>total of {total} exercises</strong>
        </p> */}
      </div>
    );
  });
};


const Header = ({ course }) => <h1>{course.name}</h1>

const Content = ({ course}) => (
  console.log('content is being called'),
  <div>
    {course.parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({ total }) => <p><strong>total of {total} exercises</strong></p>
export default Course;
