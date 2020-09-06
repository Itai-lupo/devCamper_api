export default interface IDBManager {
    
    
    
	connect(): void;

	getBootcamps(qury, params);
	getBootcamp(id);
	createBootcamp(bootcampToCreate);
	updateBootcamp(id, dataToUpdate)
	deleteBootcamp(id);
	getBootcampWithInRadius(loction, radiusAroundTheLoction);
	getBootcampAmount();

	getAllCourses(query);
	getSingleCourse(id);
	createCourse(CourseToCreate);
	updateCourse(id, dataToUpdate);
	deleteCourse(id);
	getCourseAmount();

}
