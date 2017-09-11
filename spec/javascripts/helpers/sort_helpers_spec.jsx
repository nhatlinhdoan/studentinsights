import SortHelpers from '../../../app/assets/javascripts/helpers/sort_helpers.jsx';

describe('SortHelpers', () => {
  describe('#sortByCustomEnum', () => {
    const customEnum = ['One', 'Two', 'Three', 'Four', 'Five'];
    const preSortData = [
      { testElement: 'Five' },
      { testElement: 'Four' },
      { testElement: 'Five' },
      { testElement: 'One' },
      { testElement: null }
    ];

    it('correctly sorts', () => {
      const sortData = preSortData.slice();

      const targetData = [
        { testElement: null },
        { testElement: 'One' },
        { testElement: 'Four' },
        { testElement: 'Five' },
        { testElement: 'Five' }
      ];

      sortData.sort((a, b) => SortHelpers.sortByCustomEnum(a, b, 'testElement', customEnum));

      let match = true;

      for (let i = 0; i < preSortData.length; i++) {
        if (sortData[i].testElement != targetData[i].testElement) {
          match = false;
        }
      }

      expect(match).toBe(true);
    });
  });
});