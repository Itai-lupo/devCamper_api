export default interface IDBManager {
    
    
    
	connect(url: string): void;

	getBootcamps(qury, params);
	getBootcamp(id);
	createBootcamp(bootcampToCreate);
	updateBootcamp(id, dataToUpdate)
	deleteBootcamp(id);
	getBootcampWithInRadius(loction, radiusAroundTheLoction);

	getAllCourses(query);
	getSingleCourse(id);
	createCourse(CourseToCreate);
	updateCourse(id, dataToUpdate);
	deleteCourse(id);

}
