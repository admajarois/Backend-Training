class ThreadValidator {

    validateUpdateThreadPayload(updateThread) {
      // Example validation logic
      
      if (!updateThread.id) {
        throw new Error('THREAD_VALIDATION_ERROR: Missing thread ID');
      }
      if (!updateThread.title || typeof updateThread.title !== 'string') {
        throw new Error('THREAD_VALIDATION_ERROR: Invalid or missing thread title');
      }
      if (!updateThread.body || typeof updateThread.body !== 'string') {
        throw new Error('THREAD_VALIDATION_ERROR: Invalid or missing thread content');
      }
      // Add more validation rules as needed
    }

  validateAddThreadPayload(addThread) {
    // Example validation logic
    if (!addThread.title || typeof addThread.title !== 'string') {
      throw new Error('THREAD_VALIDATION_ERROR: Invalid or missing thread title');
    }
    if (!addThread.body || typeof addThread.body !== 'string') {
      throw new Error('THREAD_VALIDATION_ERROR: Invalid or missing thread body');
    }
    // Add more validation rules as needed
  }
  }
  
  module.exports = ThreadValidator;