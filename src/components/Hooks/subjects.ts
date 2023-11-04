/*
const filterValues = {
    year: ['2022', '2023'],
    department: ['Engineering', 'Sales'],
    qualification: ['Bachelor degree', 'Masters degree']
  };

  const filter = {};
  for (const key in filterValues) {
    const values = filterValues[key];
    if (values.length === 1) {
      filter[`$${key}`] = values[0];
    } else {
      filter[`$${key}`] = { $in: values };
    }
  }
*/ 