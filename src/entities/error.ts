/**
 * Created by kfaulhaber on 19/09/2017.
 */

export class Error {
    public constructor(
      public id,
      public code,
      public title,
      public detail,
      public status = null
    ){}
}