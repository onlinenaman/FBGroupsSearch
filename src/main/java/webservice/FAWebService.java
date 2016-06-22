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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import util.FBGroupsSearch;
import vo.PostVO;
import vo.SearchVO;
import dao.FADAO;

//import vo.AccountVO;


@Path("/")
@Service
public class FAWebService {
	
	@Autowired
	FADAO fadao;
	
	@POST
	@Path("/loginWithFB")
	@Consumes({MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public int loginWithFB(String fb_long_access_token) {
		return FADAO.loginWithFB(fb_long_access_token);
	}

	@GET
	@Path("/getAllPosts")
	@Produces({MediaType.APPLICATION_JSON })	  
	public List<PostVO> getAllArticlesForUser(@QueryParam("searchText") String searchText,
			@QueryParam("excludingKeywords") String excludingKeywords,
			@QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		System.out.println("fadao = " + fadao);
		List<PostVO> postVOs = FADAO.getAllPosts(searchText, excludingKeywords, startDate, endDate);
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
		fbGroupsSearch.m1();
		return 0;
	}
	
	@GET
	@Path("/getAllSearchTexts")
	@Produces({MediaType.APPLICATION_JSON })	  
	public List<SearchText> getAllSearchTexts(@QueryParam("searchText") String searchText) {
		return FADAO.getAllSearchTexts(searchText);
	}

} 