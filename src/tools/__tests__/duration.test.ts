import getDuration from '#tools/getDuration';

describe('getDuration', () => {
  test('diff milliseconds', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 0, 1, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(1);
  });

  test('diff seconds', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 0, 2, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(1001);
  });

  test('diff minutes', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 10, 1, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(59001);
  });

  test('diff hours', () => {
    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 11, 0, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    expect(duration).toEqual(3599001);
  });

  test('exception', () => {
    const spy = jest.spyOn(Number, 'isNaN').mockImplementationOnce(() => {
      throw new Error('raise Error');
    });

    const start = new Date(Date.UTC(2023, 3, 24, 10, 0, 0, 999));
    const end = new Date(Date.UTC(2023, 3, 24, 11, 0, 0, 0));
    const duration = getDuration(start, end);

    console.log('duration: ', duration);
    spy.mockRestore();

    expect(duration).toEqual(-1);
  });
});
