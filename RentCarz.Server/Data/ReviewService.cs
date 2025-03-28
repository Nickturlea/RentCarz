using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;

public class ReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }


    // Update Review
    public async Task<Review> deleteReview(int id)
    {
        //get the review
        var review = await _context.Reviews
            .Where(c => c.MemberId == id).FirstOrDefaultAsync();

        //delete the reservation and save changes
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return null;
    }
    

    // Add review
    public async Task<Review> addReview(int MemberId, int Rating, string Comment, DateTime ReviewDate)
    {


        // Create the reservation
        var review = new Review
        {
            MemberId = MemberId,
            Rating = Rating,
            Comment = Comment,
            ReviewDate = ReviewDate
        };

        // Save to the database
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return review;
    }

   public async Task<List<Review>> getReviews()
    {
        return await _context.Reviews.ToListAsync();
    }

    public async Task<List<UserInfo>> getUsers()
    {

        //list of all users
        List<Member> memberList = await _context.Members.ToListAsync();

        List<UserInfo> userInfo = new List<UserInfo>();

        for(var i = 0; i < memberList.Count; i++){
             userInfo.Add(new UserInfo() { userId = memberList[i].MemberId, userName = memberList[i].Username });
        }
        return userInfo;
    }

    public async Task<bool> hasReviewed(int id)
    {
        var hasReviewed = await _context.Reviews
            .Where(c => c.MemberId == id).FirstOrDefaultAsync();

            if(hasReviewed == null){
                return false;
            }
            else{
                return true;
            }
        
    }

    public class UserInfo{
        //Values to pass to front end
        public int userId { get; set; }

        public string userName { get; set; }
    }
}
