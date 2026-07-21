import { getTransposedData } from './components/Report/reportUtils';

test('getTransposedData transposes simple records correctly', () => {
  const dummyData = [
    {
      selectedDate: '2026-07-16',
      totalNumberOfAdmissions: '10',
      sumOfTimeTakenforInitialAssessment: '50',
      created_by: 'admin' // should be excluded
    }
  ];

  const transposed = getTransposedData(dummyData, false);
  
  // Verify 'created_by' is excluded
  expect(transposed['Created By']).toBeUndefined();

  // Verify fields are formatted to Title Case and capitalized
  expect(transposed['Total Number Of Admissions']).toEqual(['10']);
  expect(transposed['Sum Of Time Takenfor Initial Assessment']).toEqual(['50']);
});

test('getTransposedData handles raw_data array transposition when isRawData is true', () => {
  const dummyRawData = [
    {
      selectedDate: '2026-07-16',
      raw_data: [
        {
          numberOfAdmissions: 5,
          ventilatorDays: 2
        }
      ]
    }
  ];

  const transposed = getTransposedData(dummyRawData, true);

  expect(transposed['Number Of Admissions']).toEqual([5]);
  expect(transposed['Ventilator Days']).toEqual([2]);
});

test('Incident filtering logic correctly assigns visibility based on user roles and classification assignments', () => {
  const currentUserId = 'user-123';
  
  const classData = [
    {
      id: 'cat-1',
      title: 'Medication Error',
      category_key: 'Medication Error',
      incharge_id: 'user-123',
      item_incharges: {
        'Wrong Dose': { incharge_id: 'user-456', incharge_name: 'Other Incharge' }
      }
    },
    {
      id: 'cat-2',
      title: 'Fall',
      category_key: 'Fall',
      incharge_id: 'user-789',
      item_incharges: {
        'Slip and Fall': { incharge_id: 'user-123', incharge_name: 'Test Incharge' }
      }
    }
  ];

  const checkIsAssignedLocal = (inc, userId) => {
    if (!inc) return false;
    if (!userId) return false;

    let parsedClass = {};
    if (inc.classifications) {
      if (typeof inc.classifications === 'string') {
        try {
          parsedClass = JSON.parse(inc.classifications);
        } catch (e) {
          parsedClass = {};
        }
      } else {
        parsedClass = inc.classifications;
      }
    }

    return Object.entries(parsedClass).some(([catTitle, items]) => {
      if (!Array.isArray(items) || items.length === 0) return false;
      const matchedClassObj = classData.find(c => c.category_key === catTitle || c.title === catTitle);
      if (!matchedClassObj) return false;

      const itemIncharges = matchedClassObj.item_incharges || {};
      return items.some(item => {
        const assignment = itemIncharges[item] || {};
        if (assignment.incharge_id) {
          return String(assignment.incharge_id) === String(userId);
        }
        return matchedClassObj.incharge_id && String(matchedClassObj.incharge_id) === String(userId);
      });
    });
  };

  // Test Case 1: Incident classification category matches user-123 (Incharge of Medication Error, item other than Wrong Dose)
  const incident1 = {
    classifications: {
      'Medication Error': ['Wrong Patient']
    }
  };
  expect(checkIsAssignedLocal(incident1, currentUserId)).toBe(true);

  // Test Case 2: Incident item matches user-123 specifically (Slip and Fall in Fall category, where category incharge is user-789)
  const incident2 = {
    classifications: {
      'Fall': ['Slip and Fall']
    }
  };
  expect(checkIsAssignedLocal(incident2, currentUserId)).toBe(true);

  // Test Case 3: Incident item matches someone else specifically (Wrong Dose under Medication Error category)
  const incident3 = {
    classifications: {
      'Medication Error': ['Wrong Dose']
    }
  };
  expect(checkIsAssignedLocal(incident3, currentUserId)).toBe(false);
});
