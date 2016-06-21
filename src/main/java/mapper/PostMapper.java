package mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import model.Post;

public interface PostMapper {
	
	// TODO - check name
	List<Post> searchPosts(@Param("searchTexts") List<String> searchTexts);
//	List<FeedTrendVO> numberOfArticlesForMonth(Map<String,Object> map);
//	List<FeedTrendVO> numberOfArticlesForYear(Map<String,Object> map);
//
//	List<Article> selectAll();


}