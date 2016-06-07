package util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import model.FBGroup;
import model.Post;

import org.apache.ibatis.session.SqlSessionFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dao.FADAO;

public class FBGroupsSearch implements Job{
	
	private static final String PERSISTENCE_UNIT_NAME = "FBGroupsSearch";
	private static final String FB_ACCESS_TOKEN = "1383045038690359|Ml1JiedUY9Dw5NfHHJNT1Vxu5jY";
	private static final String FB_ACCESS_TOKEN_GAE = "EAACEdEose0cBAIc5GdW0T7kUOn171ya3lJyx8Q0I9VjHQBVMRkY8ZCRB6Vu21K7tiZCTarlJBjE54YqvzsKdDu06EAl7ypjl9ZAUujo1WstZApvd2zi4lDtHB7z0ZCEIBKMCLInqtBY177sRSSwTlaxdZCMtxSzBH0eFdIzW8euQZDZD";
	private static final String FB_ACCESS_TOKEN_PAGE = "EAATp30Q9UDcBAFYi52ZCYyWSUL6NY6iMeiE75tpiCF3LzO5ynLXRzGRqj19EWHG6PNIQbwalw0zFLXgXHfy2ClNsoyIa6Vb9OTT2UsNJo54en4Q59TZCboZB6l9btCRbVhHRZAwl9ZB2AFViifQiK063ZBsLhtRBTLzmoTOuiRKAZDZD";
	
	private static final int NUMBER_OF_DAYS_OF_POSTS_TO_BE_FETCHED = 7;
	private static final int NUMBER_OF_POSTS_TO_BE_FETCHED_TempVar = 500;
	
	private static EntityManagerFactory factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);	
	private static SqlSessionFactory sqlMapper = null;
	
	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		m1();
	}
	
	public void m1() {
//		fetchGroups();
		EntityManager em = factory.createEntityManager();
		Query checkEmailExists = em.createQuery("SELECT a FROM FBGroup a");
		List<FBGroup> groups = (List<FBGroup>) checkEmailExists.getResultList();
		for (FBGroup group : groups) {
			fetchPosts(group);
		}
	}
	
	public static void fetchGroups() {

		String newUrl = "https://graph.facebook.com/v2.3/me/groups?access_token=" + FB_ACCESS_TOKEN_PAGE;
 		URL obj;
 		StringBuffer jsonResponse = new StringBuffer();
		try {
			obj = new URL(newUrl);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.addRequestProperty("User-Agent", "Mozilla/5.0");
			BufferedReader in = new BufferedReader(new InputStreamReader(
	 				con.getInputStream()));
	 		String inputLine;

	 		while ((inputLine = in.readLine()) != null) {
	 			jsonResponse.append(inputLine);
	 		}
	 		in.close();
		} catch (MalformedURLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
 		

 		JSONObject jsonObj = null;
 		
 		try {
 			jsonObj = new JSONObject(jsonResponse.toString());

 			String[] keys = JSONObject.getNames(jsonObj);
 			for (String key : keys) {

 				if (jsonObj.get(key) instanceof JSONObject) {
 					JSONObject innerData = jsonObj.getJSONObject(key);
 				} else if (jsonObj.get(key) instanceof JSONArray) {
 					JSONArray innerArray = jsonObj.getJSONArray(key);
 					for (int i = 0; i < innerArray.length(); i++) {
 						JSONObject innerJsonArray = innerArray.getJSONObject(i);
 						// Process JSON Object present in the Array }
 					}
 				} else {
 					
 				}
 			}
 		} catch (Exception e) {
 			// TODO: handle exception
 		}
 		try {
 			if (jsonObj.get("data") instanceof JSONArray) {
 				JSONArray innerArray = jsonObj.getJSONArray("data");
 				for (int i = 0; i < innerArray.length(); i++) {
 					try {
 						JSONObject innerJsonArray = innerArray.getJSONObject(i);
 						System.out.println(innerJsonArray.getString("id"));
	    					FBGroup post = new FBGroup();
	    					post.setId(innerJsonArray.getString("id"));
	    					post.setName(innerJsonArray.getString("name"));
	    					FADAO.savePost(post);
 					}
 					catch (Exception e) {
 					}
 				}
 			}
 		} catch (JSONException e) {
 			// TODO Auto-generated catch block
 			e.printStackTrace();
 		} catch (Exception e) {
			// TODO: handle exception
 			e.printStackTrace();
		}
	
	}

	// TODO - date loop code in some util? check
	public static void fetchPosts(FBGroup group) {
		Calendar cal = Calendar.getInstance();
		for (int i = 1; i <= NUMBER_OF_DAYS_OF_POSTS_TO_BE_FETCHED; i++) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String valnow1 = sdf.format(cal.getTime());
			cal.add(Calendar.DATE, -1);
			String valnow2 = sdf.format(cal.getTime());
			fetchPostsForDates(group, valnow1, valnow2);
		}
	}
	
	public static void fetchPostsForDates(FBGroup group, String s1, String s2) {
		String newUrl = "https://graph.facebook.com/v2.3/" + group.getId() + "/feed?limit=" + NUMBER_OF_POSTS_TO_BE_FETCHED_TempVar + "&access_token=" + FB_ACCESS_TOKEN_PAGE + "&fields=message&since=" + s2 + "&until=" + s1;
 		URL obj;
 		StringBuffer jsonResponse = new StringBuffer();
		try {
			obj = new URL(newUrl);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.addRequestProperty("User-Agent", "Mozilla/5.0");
			BufferedReader in = new BufferedReader(new InputStreamReader(
	 				con.getInputStream()));
	 		String inputLine;

	 		while ((inputLine = in.readLine()) != null) {
	 			jsonResponse.append(inputLine);
	 		}
	 		in.close();
		} catch (MalformedURLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
 		

 		JSONObject jsonObj = null;
 		
 		try {
 			jsonObj = new JSONObject(jsonResponse.toString());

 			String[] keys = JSONObject.getNames(jsonObj);
 			for (String key : keys) {

 				if (jsonObj.get(key) instanceof JSONObject) {
 					JSONObject innerData = jsonObj.getJSONObject(key);
 				} else if (jsonObj.get(key) instanceof JSONArray) {
 					JSONArray innerArray = jsonObj.getJSONArray(key);
 					for (int i = 0; i < innerArray.length(); i++) {
 						JSONObject innerJsonArray = innerArray.getJSONObject(i);
 						// Process JSON Object present in the Array }
 					}
 				} else {
 					
 				}
 			}
 		} catch (Exception e) {
 			// TODO: handle exception
 		}
 		try {
 			if (jsonObj.get("data") instanceof JSONArray) {
 				JSONArray innerArray = jsonObj.getJSONArray("data");
 				for (int i = 0; i < innerArray.length(); i++) {
 					try {
 						JSONObject innerJsonArray = innerArray.getJSONObject(i);
 						System.out.println(innerJsonArray.getString("id"));
	    					Post post = new Post();
	    					post.setId(innerJsonArray.getString("id"));
	    					post.setUpdated_time(innerJsonArray.getString("updated_time"));
	    					post.setMessage(innerJsonArray.getString("message"));
	    					FADAO.savePost(post);
 					}
 					catch (Exception e) {
 					}
 				}
 			}
 		} catch (JSONException e) {
 			// TODO Auto-generated catch block
 			e.printStackTrace();
 		} catch (Exception e) {
			// TODO: handle exception
 			e.printStackTrace();
		}
	}

}
