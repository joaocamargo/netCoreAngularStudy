using System;
namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dateOfBirth)
        {
            var result = DateTime.Today.Year - dateOfBirth.Date.Year;

            if (DateTime.Today.AddYears(-result) < dateOfBirth.Date)
            {
                result--;
            }
            return result;
        }
    }
}

