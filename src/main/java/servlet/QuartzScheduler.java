package servlet;

import util.FBGroupsSearch;

import java.io.IOException;

import javax.servlet.GenericServlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
 
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.ScheduleBuilder;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
 
public class QuartzScheduler extends GenericServlet {
 
    public void init(ServletConfig config) throws ServletException {
 
        super.init(config);
 
      	
    	JobDetail job = JobBuilder.newJob(FBGroupsSearch.class)
		.withIdentity("dummyJobName", "group1").build();
    	
    	Trigger trigger = TriggerBuilder
		.newTrigger()
		.withIdentity("dummyTriggerName", "group1")
		.withSchedule(
//			CronScheduleBuilder.cronSchedule("0 0/3 * * * ?"))
//			CronScheduleBuilder.cronSchedule("0 52 23 ? * SUN,MON,TUE,WED,THU,FRI,SAT"))
			CronScheduleBuilder.dailyAtHourAndMinute(1, 23))
				.build();
    	
    	//schedule it
    	Scheduler scheduler;
		try {
			scheduler = new StdSchedulerFactory().getScheduler();
			scheduler.start();
	    	scheduler.scheduleJob(job, trigger);
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    
    }
 
    @Override
    public void service(
            ServletRequest arg0, 
            ServletResponse arg1
    ) throws ServletException, IOException {
 
    }
}