class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  fillter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //queryString 예시: ?price[gte]=1500&difficulty=easy
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    // g가 없으면 가장빨리 매칭되는거 하나, 있으면 전부다.
    // { difficuly: 'easy', duration: {$gte: 5}}
    // gte, gt, lte, lt
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage') 같은 값 또 솔팅할때
      // localhost:3000/api/v1/tours?sort=-price,ratingsAverage
    } else {
      //set default
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 3) Field Limiting
    //localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // - excluding (everythis except __v);
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10, page 1, 11-20, page 2
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
