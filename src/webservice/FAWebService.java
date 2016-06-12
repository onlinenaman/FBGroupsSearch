package webservice;

import java.io.InputStream;
import java.text.ParseException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import model.SearchText;

import org.apache.log4j.Logger;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONException;
import org.json.JSONObject;

import util.FBGroupsSearch;
import vo.PostVO;
import vo.SearchVO;
import dao.FADAO;

//import vo.AccountVO;


@Path("/")
public class FAWebService {
	
//	// TODO - proper name, function etc
//	// TODO - returning HashMap. Earlier was Account. Check
//	@GET
//	@Path("/getUser")
//	@Produces({ MediaType.APPLICATION_JSON })
//	public AccountVO getUser(@QueryParam("email") String email, @QueryParam("password") String password) {
//		return FADAO.getUser(email, password);
//	}

//	@POST
//	@Path("/loginWithFB")
//	@Consumes({MediaType.APPLICATION_JSON })
//	@Produces({ MediaType.APPLICATION_JSON })
//	public AccountVO loginWithFB(String accountVO) {
//		JSONObject json = null;
//		AccountVO empTemplate = new AccountVO();
//		try {
//			json = new JSONObject(accountVO);
//			Object obj1 = json.getString("email");
//			empTemplate.setEmail((String)obj1);
//			Object obj2 = json.getString("sessionToken");
//			empTemplate.setSessionToken((String)obj2);
//			Object obj3 = json.getString("id");
//			empTemplate.setId((String)obj3);
//			Object obj4 = json.getString("name");
//			empTemplate.setName((String)obj4);
//		} catch (JSONException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return FADAO.loginWithFB(empTemplate);
//	}
	
	@GET
	@Path("/getAllPosts")
	@Produces({MediaType.APPLICATION_JSON })	  
	public List<PostVO> getAllArticlesForUser(@QueryParam("searchText") String searchText,
			@QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		List<PostVO> postVOs = FADAO.getAllPosts(searchText, startDate, endDate);
		Collections.sort(postVOs, new Comparator<PostVO>(){
			   public int compare(PostVO o1, PostVO o2){
			      return  - o1.getUpdated_time().compareTo(o2.getUpdated_time());
			   }
			});
		
		return postVOs;
	}
	
	@GET
	@Path("/fetchPostsManually")
	@Produces({MediaType.APPLICATION_JSON })	  
	public int fetchPostsManually(@QueryParam("numberOfDaysOfPostsToBeFetched") String numberOfDaysOfPostsToBeFetched,
			@QueryParam("fb_access_token_page") String fb_access_token_page) {		
		FBGroupsSearch fbGroupsSearch = new FBGroupsSearch();
		fbGroupsSearch.NUMBER_OF_DAYS_OF_POSTS_TO_BE_FETCHED = Integer.valueOf(numberOfDaysOfPostsToBeFetched);
		fbGroupsSearch.FB_ACCESS_TOKEN_PAGE = fb_access_token_page;
		fbGroupsSearch.m1();
		return 0;
	}
	
	@GET
	@Path("/getAllSearchTexts")
	@Produces({MediaType.APPLICATION_JSON })	  
	public List<SearchText> getAllSearchTexts(@QueryParam("searchText") String searchText) {
		return FADAO.getAllSearchTexts();
	}

} 